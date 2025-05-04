this is a super simple book management app with a frontend made with react vanilla js using npm and vite.
the backend was made with c++ using the crow rest api library.

to start the frontend you need to run in a bash in the client directory, npm install. to get the necessary node modules then you can run, npm run dev.
make sure you have nodejs installed on your computer.

to get the backend to work you first need to make sure you have cmake installed on your path and make sure that it's version is at least 3.18 and below 4.0 (4.0 dropped support of a lot of older cmake version causing issues with a lot of libraries) and a toolchain with c++ compiler (clang and mingw worked for me. msvc is a great option to download that has both) that supports c++ 17. most standard stuff should meet the requirements. you can probably just use the cmake and c++ vscode extensions but i havent tested those. once you have all of the above and got them in your path you can just run one of the bash scripts to build and compile everything. the binary should be in the build directory.
