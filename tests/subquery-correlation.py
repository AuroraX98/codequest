import json,sqlite3
l=next(l for l in json.load(open('content/lessons.json')) if l['id']=='sql-06')
def evaluate(code):
 db=sqlite3.connect(':memory:')
 db.executescript(l['extraFiles'][0]['code']);db.executescript(code)
 passed=all(db.execute(c['expression']).fetchone()[0]==1 for c in l['checks'])
 rows=db.execute('SELECT learner,subject,score FROM answer ORDER BY subject,learner').fetchall();db.close();return passed,rows
passed,rows=evaluate(l['solution']);assert passed and ('Dana','Math',81) in rows
wrong="CREATE TEMP TABLE answer AS SELECT learner,subject,score FROM scores WHERE score>(SELECT AVG(score) FROM scores WHERE subject=scores.subject);"
assert not evaluate(wrong)[0]
print('Passed SQL group-average correction: the correlated solution includes Dana, while the old global-average query fails the exercise check.')
