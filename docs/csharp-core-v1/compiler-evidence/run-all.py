import json,pathlib,subprocess,os,re,hashlib,time
root=pathlib.Path(__file__).resolve().parents[1];out=root/'compiler-evidence';exe='/workspace/shared/tooling/dotnet10/dotnet'
cases=[]
def add(id,code,expected='',kind='run',stdin='',exception=None):cases.append(dict(id=id,code=code,expected=expected.replace('\r\n','\n').rstrip('\n'),kind=kind,stdin=stdin,exception=exception,sha256=hashlib.sha256(code.encode()).hexdigest()))
base=root.parent/'new-languages/csharp-cpp'
for c in json.load(open(base/'companions.json')):
 if c['id'].startswith('csharp-'):
  add(c['id']+'-original',(base/c['file']).read_text(),c['expected']);add(c['id']+'-changed',(base/c['changedFile']).read_text(),c['changedExpected'])
for c in json.load(open(root/'foundations/compile-cases.json')):add(c['id'],c['code'],c['expected'],stdin=c['stdin'])
for c in json.load(open(root/'types-design/companions.json')):add(c['id']+'-original',c['code'],c['expected'].replace(' then ','\n'))
for c in json.load(open(root/'types-design/changed-cases.json')):add(c['id']+'-changed',c['code'],c['expected'],'compile-failure' if c.get('expectedOutcome')=='compile-failure' else 'run')
for c in json.load(open(root/'types-design/negative-cases.json')):add(c['id']+'-negative',c['code'],kind='compile-failure')
base=root/'applications-advanced'
for c in json.load(open(base/'execution-cases.json')):add(c['id']+'-'+c['case'],(base/c['path']/'Program.cs').read_text(),c['expectedStdout'],kind='exception' if c['expectedException'] else 'run',exception=c['expectedException'])
(out/'case-manifest.json').write_text(json.dumps(cases,indent=2)+'\n')
work=out/'work';work.mkdir(exist_ok=True);(work/'Example.csproj').write_text('<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><LangVersion>14.0</LangVersion><Nullable>enable</Nullable><ImplicitUsings>enable</ImplicitUsings></PropertyGroup></Project>');(work/'NuGet.Config').write_text('<configuration><packageSources><clear /></packageSources></configuration>')
(out/'runtime').mkdir(exist_ok=True);os.chmod(out/'runtime',0o700)
env=dict(os.environ,XDG_RUNTIME_DIR=str(out/'runtime'),DOTNET_ROOT=str(pathlib.Path(exe).parent),DOTNET_CLI_HOME=str(out/'cli-home'),DOTNET_CLI_TELEMETRY_OPTOUT='1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE='1',DOTNET_NOLOGO='1',DOTNET_SYSTEM_GLOBALIZATION_INVARIANT='1')
def run(cmd,**kw):return subprocess.run(cmd,cwd=work,env=env,text=True,capture_output=True,timeout=90,**kw)
version=run([exe,'--version']);assert version.returncode==0,version.stderr
(out/'dotnet-info.txt').write_text(run([exe,'--info']).stdout)
restore=run([exe,'restore','--configfile',str(work/'NuGet.Config'),'--nologo']);(out/'restore.log').write_text(restore.stdout+restore.stderr);assert restore.returncode==0,'restore failed'
results=[]
for c in cases:
 (work/'Program.cs').write_text(c['code']);build=run([exe,'build','--no-restore','--nologo','-v:q','-m:1'])
 result={k:v for k,v in c.items() if k!='code'};result.update(buildExit=build.returncode,buildLog=build.stdout+build.stderr)
 if c['kind']=='compile-failure':
  diagnostic={'csharp-36-changed':'CS1503','csharp-37-changed':'CS0311','csharp-24-negative':'CS0165','csharp-29-negative':'CS0272','csharp-32-negative':'CS0144','csharp-36-negative':'CS1503','csharp-37-negative':'CS0311'}[c['id']]
  result['expectedDiagnostic']=diagnostic;result['passed']=build.returncode!=0 and ('error '+diagnostic+':') in result['buildLog']
 elif build.returncode:result['passed']=False
 else:
  try:
   executed=run([exe,str(work/'bin/Debug/net10.0/Example.dll')],input=c['stdin']);stdout=executed.stdout.replace('\r\n','\n').rstrip('\n');result.update(runExit=executed.returncode,stdout=stdout,stderr=executed.stderr)
   result['passed']=stdout==c['expected'] and (executed.returncode!=0 and c['exception'] in executed.stderr if c['kind']=='exception' else executed.returncode==0)
  except subprocess.TimeoutExpired:result.update(passed=False,error='runtime timeout')
 results.append(result);(out/'results.json').write_text(json.dumps({'sdkVersion':version.stdout.strip(),'cases':results,'planned':len(cases),'complete':len(results)==len(cases)},indent=2)+'\n');print(('PASS ' if result['passed'] else 'FAIL ')+c['id'],flush=True)
summary={'sdkVersion':version.stdout.strip(),'cases':len(results),'passed':sum(x['passed'] for x in results),'failed':[x['id'] for x in results if not x['passed']],'uniqueLessons':len(set(re.match(r'csharp-\d+',x['id']).group() for x in results)),'compileFailureCases':sum(x['kind']=='compile-failure' for x in results),'expectedRuntimeExceptionCases':sum(x['kind']=='exception' for x in results)}
(out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary),flush=True)
raise SystemExit(bool(summary['failed']))
