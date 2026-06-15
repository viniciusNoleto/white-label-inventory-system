import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-500">
          <p className="text-lg font-semibold">
            Algo deu errado.
          </p>

          <p className="text-sm">
            Recarregue a página ou entre em contato com o suporte.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
