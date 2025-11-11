#include <crow.h>
#include <crow/middlewares/cors.h>
#include <fstream>
#include <cstdlib>
#include <sstream>
#include <string>

std::string booksJsonPath = std::string(BOOKS_DIR) + "books.json"; // may be overridden by BOOKS_DIR env in main()

int globalBookID = 0;

std::string jsonFormat[] = {"id","name","author"};

crow::json::wvalue loadJson(const std::string& path)
{
  std::ifstream ifstream(path);

  if(!ifstream) 
  {
    return crow::json::load("");
  }

  std::ostringstream sstream;
  sstream << ifstream.rdbuf();
  return crow::json::load(sstream.str());
}

bool modifyJson(const crow::json::wvalue& json, const std::string& path)
{
  std::ofstream ofstream(path);

  if(!ofstream)
  {
    std::cout << "Error: cannot open " + path + " in modifyJson function";
    return false;
  }

  ofstream << json.dump(4);
  return true;
}

void idBooks()
{
  auto booksJson = loadJson(booksJsonPath);
  auto& booksArray = booksJson["books"];
  for(size_t i = 0; i < booksArray.size(); i++)
  {
    if(booksArray[i].dump().find("null") != std::string::npos)
    {
      continue;
    }

    booksArray[i]["id"] = globalBookID++;
  }

  modifyJson(booksJson, booksJsonPath);
}

int main()
{
  crow::App<crow::CORSHandler> app;

  auto& corsHandler = app.get_middleware<crow::CORSHandler>();
  auto& rule = corsHandler.global();
  // Dynamic CORS origins via CORS_ALLOW_ORIGINS (comma separated) or fallback to *
  if(const char* originsEnv = std::getenv("CORS_ALLOW_ORIGINS")) {
    std::string originsStr = originsEnv;
    if(originsStr == "*") {
      rule.origin("*");
    } else {
      std::stringstream ss(originsStr);
      std::string origin;
      while(std::getline(ss, origin, ',')) {
        origin.erase(0, origin.find_first_not_of(" \t"));
        origin.erase(origin.find_last_not_of(" \t") + 1);
        if(!origin.empty()) rule.origin(origin);
      }
    }
  } else {
    rule.origin("*");
  }
  rule.methods(crow::HTTPMethod::GET, crow::HTTPMethod::POST, crow::HTTPMethod::Delete)
      .headers("Content-Type");

  // Allow overriding books directory via BOOKS_DIR env (must end with /)
  if(const char* booksDirEnv = std::getenv("BOOKS_DIR"))
  {
    std::string dir = booksDirEnv;
    if(dir.size() && dir.back() != '/') dir.push_back('/');
    booksJsonPath = dir + "books.json";
  }
  idBooks();

  CROW_ROUTE(app, "/health")
  ([]{
    return crow::response(200,"ok");
  });

  CROW_ROUTE(app, "/books")
  .methods(crow::HTTPMethod::POST)
  ([](const crow::request& req){
    auto newBookJson = crow::json::load(req.body);

    if (!newBookJson)
    {
      return crow::response(crow::status::BAD_REQUEST);
    }
    
    for(std::string key : newBookJson.keys())
    {
      if(key == "id")
      {
        return crow::response(500, "Invalid book json. dont give the book an id. the backend is responsible for that.");
      }
    }

    crow::json::wvalue exisitingJson = loadJson(booksJsonPath);

    auto& booksArray = exisitingJson["books"];
    auto& newBook =  booksArray[booksArray.size()];
    newBook = newBookJson;
    newBook["id"] = globalBookID++;
    std::cout << newBook["id"].dump();
    

    if(!modifyJson(exisitingJson, booksJsonPath))
    {
      return crow::response(500, "Failed to add book");
    }
    
    return crow::response(200, "Book added successfully");
  });

  CROW_ROUTE(app, "/books")
  .methods(crow::HTTPMethod::GET)
  ([](const crow::request& req){

    return crow::response(200, loadJson(booksJsonPath));
  });

  CROW_ROUTE(app, "/books/<int>")
  .methods(crow::HTTPMethod::Delete)
  ([](const crow::request& req, int id){

    crow::json::wvalue booksJson= loadJson(booksJsonPath);
    crow::json::wvalue resultBooksJson;
    resultBooksJson["books"] = "[]";
    auto& resultBooksArray = resultBooksJson["books"];
    auto& booksArray = booksJson["books"];

    for(size_t i = 0, resultIndex = 0; i < booksArray.size(); i++)
    {
      if(std::atoi(booksArray[i]["id"].dump().c_str()) == id)
      {
        continue;
      }

      resultBooksArray[resultIndex] = std::move(booksArray[i]);
      resultIndex++;
    }

    if(!modifyJson(resultBooksJson, booksJsonPath))
    {
      return crow::response(500, "Failed to remove book");
    }
    
    return crow::response(200, "Book removed successfully");
  });

  const char* p = std::getenv("PORT");
  int port = p ? std::stoi(p) : 3001;
  const char* hostEnv = std::getenv("HOST");
  std::string bindHost = hostEnv ? hostEnv : "0.0.0.0";

  app.port(port)
  .server_name("BooksAPI")
  .bindaddr(bindHost)
  .multithreaded()
  .run();
}
