from pathlib import Path
import csv,re
p=Path(__file__).resolve().parents[1]
ids=re.findall(r'^\| (GC-ADR-\d{3}) \|', (p/'docs/ADR.md').read_text(),re.M)
assert ids==[f'GC-ADR-{i:03d}' for i in range(1,123)],ids
with (p/'backlog.csv').open(encoding='utf-8-sig') as f: rows=list(csv.DictReader(f))
seen=set()
for r in rows:
 assert r['id'] not in seen
 assert set(filter(None,r['depends_on'].split(';'))) <= seen,r
 assert all('GC-ADR-'+a in ids for a in r['adr_ids'].split(';'))
 assert r['status']=='TODO' and not r['evidence']
 seen.add(r['id'])
print(f'OK: {len(ids)} ADR, {len(rows)} tasks; dependency order valid. Documentation only; no product tests.')
