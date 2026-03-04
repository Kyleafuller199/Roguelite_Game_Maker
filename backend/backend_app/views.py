import json
import mimetypes
import os
import subprocess

from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

ASSETS_DIR = settings.GAME_ASSETS_DIR


@require_http_methods(['GET'])
def list_assets(request):
    """
    GET /api/assets/list/?folder=monsters/basic
    Returns a sorted list of image filenames in the given subfolder.
    """
    folder = request.GET.get('folder', '')
    # Prevent path traversal
    if '..' in folder:
        return HttpResponseBadRequest('Invalid folder')

    path = ASSETS_DIR / folder
    if not path.exists() or not path.is_dir():
        return JsonResponse({'files': []})

    files = sorted(
        f for f in os.listdir(path)
        if f.lower().endswith(('.png', '.jpg', '.jpeg'))
    )
    return JsonResponse({'files': files})


@require_http_methods(['GET'])
def serve_asset(request):
    """
    GET /api/assets/file/?path=monsters/basic/goblin.png
    Serves the image file for preview in the editor.
    """
    file_path = request.GET.get('path', '')
    if '..' in file_path:
        return HttpResponseBadRequest('Invalid path')

    full_path = ASSETS_DIR / file_path
    if not full_path.exists() or not full_path.is_file():
        return HttpResponse(status=404)

    mime_type, _ = mimetypes.guess_type(str(full_path))
    with open(full_path, 'rb') as f:
        return HttpResponse(f.read(), content_type=mime_type or 'image/png')


@csrf_exempt
@require_http_methods(['POST'])
def start_run(request):
    """
    POST /api/start-run/
    Receives the run payload from the editor and writes run_config.json
    into the roguelite_map_generator directory for Kyle's viewer to read.
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    viewer_dir = ASSETS_DIR.parent
    config_path = viewer_dir / 'run_config.json'
    with open(config_path, 'w') as f:
        json.dump(payload, f, indent=2)

    # Launch the viewer as a detached subprocess (non-blocking)
    subprocess.Popen(['python3', 'main.py'], cwd=str(viewer_dir))

    return JsonResponse({'status': 'ok'})
