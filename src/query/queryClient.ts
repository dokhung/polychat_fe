import { QueryClient } from "@tanstack/react-query";

export const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false, staleTime: 30_000, refetchOnWindowFocus: false, networkMode: "always" },
        mutations: { retry: false, gcTime: 0, networkMode: "always" },
    },
});

export const authQueryKeys: {
    all: readonly ["auth"];
    currentUser: readonly ["auth", "me"];
    email: (email: string) => readonly ["auth", "email-availability", string];
} = {
    all: ["auth"],
    currentUser: ["auth", "me"],
    email: (email: string): readonly ["auth", "email-availability", string] => ["auth", "email-availability", email],
};

export function clearAuthQueries(): void {
    // Cancellation prevents a pending response from restoring a previous user's cache.
    void queryClient.cancelQueries({ queryKey: authQueryKeys.all });
    queryClient.removeQueries({ queryKey: authQueryKeys.all });
}
