import Float "mo:base/Float";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor Calculator {
  stable var calculationHistory: [(Text, Float, Float, Float)] = [];

  public func calculate(operation: Text, num1: Float, num2: Float): async Float {
    var result: Float = 0;
    
    switch (operation) {
      case ("+") { result := num1 + num2; };
      case ("-") { result := num1 - num2; };
      case ("*") { result := num1 * num2; };
      case ("/") {
        if (num2 == 0) {
          Debug.trap("Division by zero");
        };
        result := num1 / num2;
      };
      case (_) { Debug.trap("Invalid operation"); };
    };

    calculationHistory := Array.append(calculationHistory, [(operation, num1, num2, result)]);
    if (Array.size(calculationHistory) > 10) {
      calculationHistory := Iter.toArray(Array.slice(calculationHistory, Array.size(calculationHistory) - 10, Array.size(calculationHistory)));
    };

    result
  };

  public query func getHistory(): async [(Text, Float, Float, Float)] {
    calculationHistory
  };

  public func clearHistory(): async () {
    calculationHistory := [];
  };
}
