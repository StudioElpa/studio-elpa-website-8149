import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rememberUtm } from "../lib/lead-relay";

const queryClient = new QueryClient();

/* Keep the landing URL's utm_* for the visit, so a mailer lead that submits on a
   later page still carries its mail code. Runs once, on first load. */
rememberUtm();

interface ProviderProps {
  children: React.ReactNode;
}

// App-level providers — add theme/context providers here, wrapping children.
// QueryClientProvider must stay (all API calls run through TanStack Query).
export function Provider({ children }: ProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
