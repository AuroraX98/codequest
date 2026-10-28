using System;
using System.Collections.Generic;
using System.Text.Json;
var sessions = new List<StudySession>();
Console.WriteLine(TryAdd(sessions, "Read", 10));
Console.WriteLine(TryAdd(sessions, "Practice", 5));
Console.WriteLine(sessions.Count);
Console.WriteLine(JsonSerializer.Serialize(sessions));
static bool TryAdd(List<StudySession> target, string title, int minutes)
{
    if (string.IsNullOrWhiteSpace(title) || minutes <= 0) return false;
    target.Add(new StudySession(title.Trim(), minutes));
    return true;
}
public record StudySession(string Title, int Minutes);
