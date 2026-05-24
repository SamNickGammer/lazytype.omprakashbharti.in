import SwiftUI

/// Centralized LazyType brand palette.
///
/// LazyType uses a distinct violet identity (instead of the system blue) so the
/// overlay, menu bar, setup, and settings all read as one branded product.
/// Colors are defined here once so the whole app stays visually consistent.
extension Color {
    /// Primary brand accent — LazyType violet.
    static let brand = Color(red: 0.42, green: 0.36, blue: 0.96) // #6B5CF5

    /// Secondary brand accent used for gradients and highlights.
    static let brandSecondary = Color(red: 0.66, green: 0.33, blue: 0.97) // #A855F7
}

extension ShapeStyle where Self == Color {
    /// Convenience so call sites can use `.brand` anywhere a `Color` is expected.
    static var brand: Color { Color.brand }
    static var brandSecondary: Color { Color.brandSecondary }
}

/// Signature LazyType gradient (top-leading violet → bottom-trailing magenta).
enum BrandGradient {
    static let accent = LinearGradient(
        colors: [Color.brand, Color.brandSecondary],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
