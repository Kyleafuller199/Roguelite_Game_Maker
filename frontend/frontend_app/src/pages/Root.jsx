import OneColumnLayout from "../layouts/OneColumnLayout";
import PublicHeader from "../components/PublicHeader";
import { Link } from "react-router-dom";

export default function Root() {
  return (
    <OneColumnLayout
      header={
        <PublicHeader
          title="Roguelite Game Maker"
          rightAction={
            <>
              <Link to="/auth">Login</Link>{" "}
              <Link to="/auth">Create Account</Link>
            </>
          }
        />
      }
    >
      <h2>Root main area</h2>
    </OneColumnLayout>
  );
}