#include <chrono>
#include <iostream>
int main() {
    auto start = std::chrono::steady_clock::now();
    auto finish = std::chrono::steady_clock::now();
    auto elapsed = finish - start;
    std::cout << std::boolalpha
              << (elapsed >= std::chrono::steady_clock::duration::zero())
              << "\n";
}
