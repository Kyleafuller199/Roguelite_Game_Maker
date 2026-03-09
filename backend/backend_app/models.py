from django.db import models


class EditorSnapshot(models.Model):
    """
    Stores the full editor state as a JSON blob, keyed by browser session.
    One row per session_key — no auth required.
    """
    session_key = models.CharField(max_length=64, unique=True, db_index=True)
    state = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.session_key[:8]}… @ {self.updated_at:%Y-%m-%d %H:%M}"
