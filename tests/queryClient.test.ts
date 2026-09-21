import assert from "node:assert/strict";
import { test } from "node:test";
import { QueryObserver } from "@tanstack/react-query";
import { authQueryKeys, clearAuthQueries, queryClient } from "../src/query/queryClient.ts";

test("email lookup waits for an explicit refetch and separates email cache keys", async (): Promise<void> => {
    let calls: number = 0;
    const observer: QueryObserver<string, Error> = new QueryObserver<string, Error>(queryClient, {
        queryKey: authQueryKeys.email("first@example.com"),
        queryFn: async (): Promise<string> => { calls++; return "available"; },
        enabled: false,
    });
    const unsubscribe: () => void = observer.subscribe((): void => {});
    try {
        assert.equal(calls, 0);
        await observer.refetch();
        assert.equal(calls, 1);
        assert.equal(queryClient.getQueryData(authQueryKeys.email("first@example.com")), "available");
        assert.equal(queryClient.getQueryData(authQueryKeys.email("second@example.com")), undefined);
    } finally {
        unsubscribe();
        queryClient.clear();
    }
});

test("auth cache cleanup cancels an in-flight user query and cannot restore its result", async (): Promise<void> => {
    let resolveRequest: (value: string) => void = (): void => {};
    const response: Promise<string> = new Promise<string>((resolve: (value: string) => void): void => { resolveRequest = resolve; });
    const pending: Promise<string | undefined> = queryClient.fetchQuery({
        queryKey: authQueryKeys.currentUser,
        queryFn: (): Promise<string> => response,
    }).catch((): undefined => undefined);
    queryClient.setQueryData(["public"], "retain");
    clearAuthQueries();
    resolveRequest("previous user");
    await pending;
    assert.equal(queryClient.getQueryData(authQueryKeys.currentUser), undefined);
    assert.equal(queryClient.getQueryData(["public"]), "retain");
    queryClient.clear();
});

test("failed authentication queries are not automatically retried", async (): Promise<void> => {
    let calls: number = 0;
    await assert.rejects(queryClient.fetchQuery({
        queryKey: authQueryKeys.currentUser,
        queryFn: async (): Promise<never> => { calls++; throw new Error("unauthorized"); },
    }));
    assert.equal(calls, 1);
    queryClient.clear();
});
