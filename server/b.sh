#!/bin/bash
if [ ! -d "build" ]; then
mkdir build
fi

cmake -S . -B build -G Ninja #-DCMAKE_TOOLCHAIN_FILE=clang-toolchain.cmake
(cd build && ninja)