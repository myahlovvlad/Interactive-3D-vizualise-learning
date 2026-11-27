"""Independent numerical quadrature for the default synthetic capillary case."""
import json, math
from pathlib import Path
T=373.15; p=200000.; q=101325.; L=30.; r=.000125; eta=1.96e-5*(T/293.15)**.7
# Integrate the local hydraulic resistance in p² coordinates; then residence time via quadrature.
Q=math.pi*r**4*(p*p-q*q)/(16*eta*L*q)
n=100000
pressure=lambda z: math.sqrt(p*p-(p*p-q*q)*z/L)
tm=sum(math.pi*r*r*pressure((i+.5)*L/n)/(Q*q)*L/n for i in range(n))
Path(__file__).with_name('reference.json').write_text(json.dumps({'flowMlMin':Q*6e7,'deadTimeS':tm},indent=2)+'\n')
