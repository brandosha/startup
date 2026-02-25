import { useEffect, useState } from "react";
import { AuthManager, useAuth } from "../_lib/AuthManager";

interface IfAuthProps {
  content: (auth: AuthManager) => React.ReactNode;
  noAuthContent?: React.ReactNode;
  loadingContent?: React.ReactNode;
}

export default function IfAuth(props: IfAuthProps) {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser();

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      auth.fetchCurrentUser().then(() => setLoading(false));
    }
  }, [auth]);

  if (user) {
    return props.content(auth);
  } else {
    if (props.loadingContent && loading) {
      return props.loadingContent;
    } else {
      return props.noAuthContent;
    }
  }
}