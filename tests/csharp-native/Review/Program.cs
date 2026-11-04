using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

string root = Path.GetFullPath(args[0]);
string sdk = Path.GetFullPath(args[1]);
var refs = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!).Split(Path.PathSeparator).Select(p => MetadataReference.CreateFromFile(p)).ToArray();
var options = new CSharpParseOptions(LanguageVersion.CSharp14);
var jsonOptions = new JsonSerializerOptions { WriteIndented = true };
var manifest = JsonDocument.Parse(File.ReadAllText(Path.Combine(root, "docs/csharp-core-v1/compiler-evidence/case-manifest.json"))).RootElement;
var results = new List<object>();
string scratch = Path.GetFullPath(Path.Combine(root, "../csharp-native-check"));
Directory.CreateDirectory(scratch);
foreach (var item in manifest.EnumerateArray())
{
    string id = item.GetProperty("id").GetString()!;
    string code = item.GetProperty("code").GetString()!;
    string kind = item.GetProperty("kind").GetString()!;
    var tree = CSharpSyntaxTree.ParseText(code, options);
    var compilation = CSharpCompilation.Create(id, new[] { tree }, refs, new CSharpCompilationOptions(OutputKind.ConsoleApplication, nullableContextOptions: NullableContextOptions.Enable));
    string folder = Path.Combine(scratch, id); Directory.CreateDirectory(folder);
    string dll = Path.Combine(folder, id + ".dll");
    var emitted = compilation.Emit(dll);
    var errors = emitted.Diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error).Select(d => d.ToString()).ToArray();
    string stdout = "", stderr = ""; int exit = -1; bool passed;
    if (kind == "compile-failure") passed = !emitted.Success;
    else if (!emitted.Success) passed = false;
    else
    {
        File.WriteAllText(Path.Combine(folder, id + ".runtimeconfig.json"), "{\"runtimeOptions\":{\"tfm\":\"net10.0\",\"framework\":{\"name\":\"Microsoft.NETCore.App\",\"version\":\"10.0.0\"},\"configProperties\":{\"System.Globalization.Invariant\":true}}}");
        var start = new ProcessStartInfo(sdk) { WorkingDirectory = folder, RedirectStandardOutput = true, RedirectStandardError = true, RedirectStandardInput = true, CreateNoWindow = true };
        start.ArgumentList.Add(dll);
        using var process = Process.Start(start)!;
        await process.StandardInput.WriteAsync(item.GetProperty("stdin").GetString()); process.StandardInput.Close();
        var outputTask = process.StandardOutput.ReadToEndAsync(); var errorTask = process.StandardError.ReadToEndAsync();
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(15));
        try { await process.WaitForExitAsync(timeout.Token); }
        catch (OperationCanceledException) { process.Kill(true); throw new Exception("Timed out: " + id); }
        stdout = (await outputTask).Replace("\r\n", "\n").TrimEnd(); stderr = (await errorTask).Replace("\r\n", "\n").TrimEnd(); exit = process.ExitCode;
        passed = stdout == item.GetProperty("expected").GetString() && (kind == "exception" ? exit != 0 && stderr.Contains(item.GetProperty("exception").GetString()!) : exit == 0);
    }
    results.Add(new { id, kind, passed, codeSha256 = Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(code))), stdout, stderr, exit, errors });
    Console.WriteLine($"{(passed ? "PASS" : "FAIL")} {id}");
}
string evidence = Path.Combine(root, "docs/csharp-wording-v1/native-results.json");
File.WriteAllText(evidence, JsonSerializer.Serialize(new { compiler = "Roslyn from .NET SDK 10.0.403", language = "C# 14", platform = "Windows x64", utc = DateTimeOffset.UtcNow, results }, jsonOptions) + "\n");
if (results.Any(r => !(bool)r.GetType().GetProperty("passed")!.GetValue(r)!)) Environment.Exit(1);
