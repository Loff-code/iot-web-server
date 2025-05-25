import os
from sympy import *

str1 = 'curl -X POST ssh.loffy.dk/data_receiver      -d "sensor_data='
str2 = '"      -d "coolState=false"       -d "time_stamp=19:19:19"     -d "date_stamp=19/09/2021"'

for i in range(100):
    out = ((sin(2 * pi / 100 * i ) +2 ) * 1000).evalf()
    stringer = str1 + str(out) + str2
    os.system(stringer)
