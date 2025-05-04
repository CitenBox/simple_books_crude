#!/bin/bash
if [ -d "build" ]; then
rm -rf build
fi

mkdir build
cmake -S . -B build -G Ninja #-DCMAKE_TOOLCHAIN_FILE=clang-toolchain.cmake
(cd build && ninja) 
