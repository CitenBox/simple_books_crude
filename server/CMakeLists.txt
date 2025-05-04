cmake_minimum_required(VERSION 3.18)
project(BooksApi)

set(CMAKE_CXX_STANDARD 17) 

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)

set(ASIO_STANDALONE    ON CACHE BOOL "" FORCE)
set(ASIO_USE_ASIO_CMAKE ON CACHE BOOL "" FORCE)
FetchContent_Declare(
  asio
  GIT_REPOSITORY https://github.com/chriskohlhoff/asio.git
  GIT_TAG        asio-1-18-1
)
FetchContent_MakeAvailable(asio)
#find_package(Threads REQUIRED)

list(APPEND CMAKE_PREFIX_PATH "${asio_SOURCE_DIR}/asio")  

FetchContent_Declare(
  Crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG        v1.2.1
)
FetchContent_MakeAvailable(Crow)

add_executable(BooksApi
  src/main.cpp
)

if (WIN32)
    target_link_libraries(BooksApi PRIVATE ws2_32 Mswsock)
endif()

target_link_libraries(BooksApi PRIVATE
  Crow::Crow
)

target_compile_definitions(BooksApi PUBLIC BOOKS_DIR="${CMAKE_SOURCE_DIR}/")

