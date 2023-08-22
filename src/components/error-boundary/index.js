import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ErrorPage } from "../card";
import Layout from "../layout";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (hasError) {
      setHasError(false);
    }
  }, [router.asPath]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ErrorBoundaryInner hasError={hasError} setHasError={setHasError}>
      {children}
    </ErrorBoundaryInner>
  );
};

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(prevProps, _previousState) {
    if (!this.props.hasError && prevProps.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error, errorInfo) {
    this.props.setHasError(true);
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Layout>
          <ErrorPage
            errorCode={"CSR_ERR"}
            errorMessage={"Ups, Something went wrong"}
          />
        </Layout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
