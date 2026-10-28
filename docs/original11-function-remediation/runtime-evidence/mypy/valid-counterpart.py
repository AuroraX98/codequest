def first_title(groups: dict[str, list[str]], key: str) -> str | None:
    titles = groups.get(key, [])
    return titles[0] if titles else None

def identity_count(value: int) -> int:
    return value
print(first_title({"today": ["Read", "Draw"]}, "today"))
print(first_title({"today": []}, "today"))
print(identity_count(4))