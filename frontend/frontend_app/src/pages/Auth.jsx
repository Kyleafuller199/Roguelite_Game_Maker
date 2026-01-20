import OneColumnLayout from "../layouts/OneColumnLayout";
import PublicHeader from "../components/PublicHeader";
import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <OneColumnLayout
      header={
        <PublicHeader
          title="Sign In"
          leftAction={<Link to="/">Back</Link>}
        />
      }
    >
      <h2>Auth main area</h2>
      <Link to="/dashboard">Continue</Link>
    </OneColumnLayout>
  );
}
