from collections import defaultdict, deque
from collections.abc import Callable
from threading import Lock
from time import time
from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    def __init__(self) -> None:
        self._requests: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def allow(self, key: str, *, limit: int, window_seconds: int) -> bool:
        now = time()
        window_start = now - window_seconds
        with self._lock:
            bucket = self._requests[key]
            while bucket and bucket[0] < window_start:
                bucket.popleft()
            if len(bucket) >= limit:
                return False
            bucket.append(now)
            return True


rate_limiter = InMemoryRateLimiter()


def _client_key(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def rate_limit(*, limit: int, window_seconds: int, scope: str) -> Callable:
    def dependency(request: Request) -> None:
        key = f"{scope}:{request.url.path}:{_client_key(request)}"
        if rate_limiter.allow(key, limit=limit, window_seconds=window_seconds):
            return
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
        )

    return dependency
