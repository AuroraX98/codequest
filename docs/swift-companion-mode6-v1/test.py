import ast,hashlib,importlib.util,json,pathlib,subprocess
P=pathlib.Path(__file__).parent
spec=importlib.util.spec_from_file_location('staged_swift',P/'codequest-swift-runner.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
rows=[]
def check(name,actual):
 rows.append({'id':name,'passed':bool(actual)});assert actual,name
for text,expected in [('Apple Swift version 6.0.3 (swiftlang-6.0.3.1.10 clang-1600.0.26.2)',(6,0,3)),('Swift version 6.4.1 (swift-6.4.1-RELEASE)\nTarget: x86_64-unknown-linux-gnu',(6,4,1)),('Swift version 5.10 (swift-5.10-RELEASE)',(5,10,0)),('Apple Swift version 6.1-dev (LLVM)',None),('driver build 600.0',None),('',None)]:check('parse '+repr(text),m.parse_compiler_version(text)==expected)
# A development suffix is not a verified stable minimum; failure is explicit rather than silently using defaults.
original_run=m.subprocess.run
try:
 for output in ['Swift version 6.4.1 (swift-6.4.1-RELEASE)','Apple Swift version 5.9.2 (swiftlang)']:
  calls=[]
  def fake_version(command,**kwargs):
   calls.append((command,kwargs));return subprocess.CompletedProcess(command,0,output,'')
  m.subprocess.run=fake_version
  check('version invocation '+output,m.installed_compiler_version('/trusted/swiftc')==m.parse_compiler_version(output) and calls[0][0]==['/trusted/swiftc','--version'] and calls[0][1]['timeout']==5)
 def broken(*a,**k):raise subprocess.TimeoutExpired(a[0],5)
 m.subprocess.run=broken;check('version timeout fails closed',m.installed_compiler_version('/trusted/swiftc') is None)
finally:m.subprocess.run=original_run
m.SANDBOX='/usr/bin/sandbox-exec';m.COMPILER='/trusted/toolchain/usr/bin/swiftc';m.SDK='/trusted/sdk';m.DRIVER=None
calls=[]
def fake_limited(command,*args,**kwargs):calls.append(command);return 0,'','',False
m.run_limited=fake_limited
payload={'code':'print("Ready")','checks':[],'typecheck':True}
for version,phrase in [(None,'could not be verified'),((5,10,0),'too old')]:
 m.COMPILER_VERSION=version;calls.clear();result=m.run_swift(payload);check('reject version '+str(version),phrase in result['error'] and not calls)
for driver in [None,'/trusted/toolchain/usr/bin/swift-driver']:
 m.DRIVER=driver;m.COMPILER_VERSION=(6,4,1)
 for typecheck in [True,False]:
  calls.clear();result=m.run_swift({**payload,'typecheck':typecheck});cmd=calls[0]
  check('mode6 fixed '+str(driver)+' '+str(typecheck),cmd.count('-swift-version')==1 and cmd[cmd.index('-swift-version')+1]=='6' and cmd[0]==m.SANDBOX and '-sdk' in cmd and '-module-cache-path' in cmd)
  check('typecheck switch '+str(driver)+' '+str(typecheck),('-typecheck' in cmd)==typecheck)
# Unchanged security and transport code is structurally exact, not merely matching a few keywords.
old=ast.parse((P/'baseline.py').read_text());new=ast.parse((P/'codequest-swift-runner.py').read_text())
oldnodes={n.name:n for n in old.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))};newnodes={n.name:n for n in new.body if isinstance(n,(ast.FunctionDef,ast.ClassDef))}
for name in oldnodes:
 if name=='run_swift':continue
 check('unchanged '+name,ast.dump(oldnodes[name],include_attributes=False)==ast.dump(newnodes[name],include_attributes=False))
oldassign=[ast.dump(n,include_attributes=False) for n in old.body if isinstance(n,ast.Assign)];newassign=[ast.dump(n,include_attributes=False) for n in new.body if isinstance(n,ast.Assign)]
check('all previous constants unchanged',all(n in newassign for n in oldassign))
result={'passed':len(rows),'total':len(rows),'rows':rows,'candidateSha256':hashlib.sha256((P/'codequest-swift-runner.py').read_bytes()).hexdigest(),'baselineSha256':hashlib.sha256((P/'baseline.py').read_bytes()).hexdigest(),'limits':'Command construction and version logic tested with mocked subprocess execution. No macOS sandbox/compiler/SDK execution claimed. Actual native mode6 Swift proof is separately in swift-core-audit/runtime-evidence.'}
(P/'test-results.json').write_text(json.dumps(result,indent=2));print(len(rows),'PASS')
