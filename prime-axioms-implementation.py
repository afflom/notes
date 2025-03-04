import numpy as np
import matplotlib.pyplot as plt
from sympy import isprime, primerange
from math import log

class CliffordFiber:
    """
    A simplified representation of a Clifford algebra fiber at a point x.
    This represents the algebraic structure where numbers are embedded.
    """
    def __init__(self, dimension=10, max_base=10):
        self.dimension = dimension  # Number of grades in the algebra
        self.max_base = max_base    # Maximum base to consider for expansions
        
    def embed_number(self, N):
        """
        Embed a natural number N into the Clifford fiber by encoding
        its representations in multiple bases.
        
        Returns the canonical representation (mimicking the coherence norm minimization).
        """
        if N < 1:
            raise ValueError("Only natural numbers >= 1 can be embedded")
            
        # Create a representation with different base expansions
        representation = {}
        
        # For each base, compute the digit expansion of N
        for base in range(2, self.max_base + 1):
            digits = []
            n = N
            while n > 0:
                digits.append(n % base)
                n //= base
            representation[base] = digits[::-1]  # Reverse to get most significant digit first
            
        return CanonicalNumberRepresentation(N, representation)
    
    def coherence_norm(self, representation):
        """
        Compute the coherence norm of a number representation.
        The norm measures how internally consistent the representation is.
        
        Lower norm = more coherent representation.
        """
        # Simplified implementation - in a full version this would measure
        # the consistency across all base representations
        
        # Count different ways to factorize the number as a proxy for coherence
        value = representation.value
        factors = sum(1 for i in range(1, int(value**0.5) + 1) 
                     if value % i == 0)
        
        # Prime numbers have exactly 2 factors (1 and themselves)
        # and are considered more "coherent" (lower norm)
        if factors == 2:
            return value  # Prime numbers: baseline coherence
        else:
            # More factors = less coherent, so higher norm
            return value * (1 + 0.1 * (factors - 2))

class CanonicalNumberRepresentation:
    """
    Represents a natural number embedded in the Prime framework.
    Contains the multi-base expansion and supports arithmetic operations.
    """
    def __init__(self, value, base_expansions):
        self.value = value
        self.base_expansions = base_expansions
        
    def __str__(self):
        return f"Canonical Representation of {self.value}"
    
    def __repr__(self):
        return f"CRep({self.value})"
    
    def __mul__(self, other):
        """Implement multiplication in the Clifford algebra"""
        # In a full implementation, we would multiply the representations
        # according to Clifford algebra rules. For simplicity, we just 
        # multiply the values and create a new canonical representation.
        product_value = self.value * other.value
        
        # We'd create a new fiber to embed the product
        fiber = CliffordFiber()
        return fiber.embed_number(product_value)
    
    def is_factorizable(self):
        """Check if the number can be factorized (is not prime)"""
        # A number is factorizable if it has factors other than 1 and itself
        if self.value <= 1:
            return False  # 1 is not prime but also not factorizable per definition
            
        for i in range(2, int(self.value**0.5) + 1):
            if self.value % i == 0:
                return True
                
        return False

def is_intrinsic_prime(N, fiber):
    """
    Determine if a number is prime according to the Prime framework.
    
    A number is prime if it cannot be factorized within the framework.
    """
    if N <= 1:
        return False
        
    representation = fiber.embed_number(N)
    return not representation.is_factorizable()

def analyze_prime_distribution(max_N=1000):
    """
    Analyze the distribution of primes as predicted by the framework.
    Compare with the Prime Number Theorem prediction: π(x) ~ x/ln(x)
    """
    fiber = CliffordFiber()
    
    # Find all primes up to max_N using our framework
    framework_primes = [n for n in range(2, max_N+1) 
                        if is_intrinsic_prime(n, fiber)]
    
    # Count primes up to each x
    x_values = np.arange(10, max_N+1, 10)
    counts = [sum(1 for p in framework_primes if p <= x) for x in x_values]
    
    # Compare with PNT prediction: x/ln(x)
    pnt_predictions = [x / log(x) for x in x_values]
    
    # Plot the comparison
    plt.figure(figsize=(10, 6))
    plt.plot(x_values, counts, 'b-', label='Actual Prime Count')
    plt.plot(x_values, pnt_predictions, 'r--', label='PNT Prediction: x/ln(x)')
    plt.xlabel('N')
    plt.ylabel('Number of Primes ≤ N')
    plt.title('Prime Distribution vs. Prime Number Theorem Prediction')
    plt.legend()
    plt.grid(True)
    
    # Calculate ratio of actual/predicted to show convergence to 1
    ratios = [actual/predicted for actual, predicted in zip(counts, pnt_predictions)]
    plt.figure(figsize=(10, 6))
    plt.plot(x_values, ratios, 'g-')
    plt.axhline(y=1, color='r', linestyle='-')
    plt.xlabel('N')
    plt.ylabel('Ratio: π(N) / (N/ln(N))')
    plt.title('Convergence to Prime Number Theorem')
    plt.grid(True)
    
    # Return data for analysis
    return {
        'x_values': x_values,
        'prime_counts': counts,
        'pnt_predictions': pnt_predictions,
        'primes': framework_primes
    }

def compute_zeta_partial_sum(s, max_terms=1000):
    """
    Compute a partial sum of the Riemann zeta function
    ζ(s) = ∑(n=1 to ∞) 1/n^s
    
    This mirrors the framework's ζ_P(s) function.
    """
    return sum(1 / (n ** s) for n in range(1, max_terms + 1))

def compute_zeta_euler_product(s, max_primes=100):
    """
    Compute a partial product of the Euler product form of zeta
    ζ(s) = ∏(p prime) 1/(1-p^(-s))
    
    This is analogous to the framework's ζ_P(s) function.
    """
    primes = list(primerange(2, max_primes + 1))
    product = 1.0
    for p in primes:
        product *= 1.0 / (1.0 - p ** (-s))
    return product

# Execute the implementation

# 1. Create a Clifford fiber to embed numbers
fiber = CliffordFiber(dimension=10, max_base=10)

# 2. Embed some numbers and check their representations
print("=== Number Embedding Examples ===")
for n in [7, 12, 23]:
    rep = fiber.embed_number(n)
    print(f"\nNumber {n} embedded:")
    
    # Show digit expansions in different bases
    for base, digits in rep.base_expansions.items():
        print(f"  Base {base}: {digits}")
    
    # Compute coherence norm
    norm = fiber.coherence_norm(rep)
    print(f"  Coherence norm: {norm:.2f}")
    
    # Check if prime
    is_prime = is_intrinsic_prime(n, fiber)
    print(f"  Is intrinsic prime: {is_prime}")

# 3. Show multiplication in the framework
print("\n=== Multiplication in the Framework ===")
a = fiber.embed_number(3)
b = fiber.embed_number(5)
product = a * b
print(f"{a} * {b} = {product}")

# 4. Analyze prime distribution
print("\n=== Prime Distribution Analysis ===")
results = analyze_prime_distribution(max_N=200)
print(f"First 10 primes in our framework: {results['primes'][:10]}")
print(f"Number of primes up to 100: {sum(1 for p in results['primes'] if p <= 100)}")
print(f"Number of primes up to 200: {len(results['primes'])}")

# 5. Demonstrate zeta function connection (for s > 1)
print("\n=== Zeta Function Analysis ===")
s = 2
sum_form = compute_zeta_partial_sum(s, max_terms=1000)
product_form = compute_zeta_euler_product(s, max_primes=100)
print(f"ζ({s}) via sum: {sum_form:.8f}")
print(f"ζ({s}) via Euler product: {product_form:.8f}")
print(f"Absolute difference: {abs(sum_form - product_form):.8f}")

# Compare with exact result for ζ(2) = π²/6
from math import pi
exact = (pi ** 2) / 6
print(f"Exact value ζ(2) = π²/6: {exact:.8f}")
print(f"Error in sum approximation: {abs(sum_form - exact):.8f}")
