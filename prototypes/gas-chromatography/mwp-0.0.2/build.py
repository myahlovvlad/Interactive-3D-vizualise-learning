from pathlib import Path
import json
p=Path(__file__).parent
core=(p/'src/core.js').read_text(); scene=(p/'src/scene.js').read_text(); ui=(p/'src/ui.js').read_text()
s=(p/'src/template.html').read_text().replace('<!-- SCRIPTS -->','<script>const CORE_SOURCE='+json.dumps(core)+';\n'+core+'\n'+scene+'\n'+ui+'</script>')
(p/'index.html').write_text(s)
