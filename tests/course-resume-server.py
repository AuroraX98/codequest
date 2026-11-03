"""Exercise the actual bookmark UPDATE against SQLite without a live account."""
import json
import re
import sqlite3
from pathlib import Path
source = Path('app/api/quest/route.ts').read_text()
sql = re.search(r'db\(\)\.prepare\("(UPDATE profiles SET settings=json_set[^"\n]+)"\)', source).group(1)
con = sqlite3.connect(':memory:')
con.execute('CREATE TABLE profiles(user_id TEXT, settings TEXT)')
old = dict(view='quest', studioMode='course', phase='learn', activeId='python-01', paragraph=1, concept='names', savedAt='2026-11-03T12:00:00.000Z')
con.execute('INSERT INTO profiles VALUES (?,?)', ('user', json.dumps({'theme':'dark','courseBookmarks':{'python':old,'javascript':{'activeId':'javascript-02'}}})))
def save(bookmark):
    path = '$.courseBookmarks.python'
    con.execute(sql, (path,json.dumps(bookmark),'user',path+'.savedAt',path+'.savedAt',bookmark['savedAt']))
def settings():
    return json.loads(con.execute('SELECT settings FROM profiles').fetchone()[0])
new = {**old,'paragraph':2,'savedAt':'2026-11-03T14:00:00.000Z'}
new.pop('concept')
save(new)
assert settings()['courseBookmarks']['python'] == new, 'Replace full bookmark, removing omitted concept'
save(old)
assert settings()['courseBookmarks']['python'] == new, 'Reject stale queued device write'
assert settings()['courseBookmarks']['javascript'] == {'activeId':'javascript-02'}
assert settings()['theme'] == 'dark'
con.execute('UPDATE profiles SET settings=?', ('{}',))
save(old)
assert settings()['courseBookmarks']['python'] == old, 'First bookmark creates missing map'
print('PASS actual server bookmark SQL: newest wins, full replacement clears concept, other courses/settings preserved, first bookmark works.')
