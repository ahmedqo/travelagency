// Place fonts/logos.ttf in your fonts/ directory and
// add the following to your pubspec.yaml
// flutter:
//   fonts:
//    - family: logos
//      fonts:
//       - asset: fonts/logos.ttf
import 'package:flutter/widgets.dart';

class Logos {
  Logos._();

  static const String _fontFamily = 'logos';

  static const IconData logo = IconData(0xe900, fontFamily: _fontFamily);
  static const IconData text = IconData(0xe901, fontFamily: _fontFamily);
}
