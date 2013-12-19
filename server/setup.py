#!/usr/bin/env python

import os
from distutils.core import setup
from glob import glob

def glob_files(path):
    return [f for f in glob(path) if os.path.isfile(f)]

setup(
    name="sudo",
    version="0.0.1",
    packages=[
        "sudo",
        "sudo.models",
    ],
    data_files=[
        ("config", glob_files("config/*"))
    ],
    zip_safe=False,
    test_suite="nose.collector",
)
