import { describe, it, expect, vi } from 'vitest';
import { useFormValidation } from '../hooks/useFormValidation';
import { renderHook, act } from '@testing-library/react';
import { validationRules } from '../hooks/useFormValidation';

// Mock the useState and other React hooks if needed
// For this test, we'll test the validation rules directly since they're pure functions

describe('validationRules', () => {
  it('should validate required field', () => {
    const rule = validationRules.required('Field is required');
    expect(rule.validate('')).toBe(false);
    expect(rule.validate('test')).toBe(true);
    expect(rule.validate(null)).toBe(false);
    expect(rule.validate(undefined)).toBe(false);
  });

  it('should validate email', () => {
    const rule = validationRules.email('Invalid email');
    expect(rule.validate('')).toBe(true); // empty is valid (handled by required)
    expect(rule.validate('test@example.com')).toBe(true);
    expect(rule.validate('invalid-email')).toBe(false);
  });

  it('should validate minLength', () => {
    const rule = validationRules.minLength(3, 'Too short');
    expect(rule.validate('')).toBe(true); // empty is valid (handled by required)
    expect(rule.validate('ab')).toBe(false);
    expect(rule.validate('abc')).toBe(true);
    expect(rule.validate('abcd')).toBe(true);
  });

  it('should validate minValue', () => {
    const rule = validationRules.minValue(18, 'Must be 18 or older');
    expect(rule.validate(0)).toBe(true); // 0 is valid (handled by required)
    expect(rule.validate(17)).toBe(false);
    expect(rule.validate(18)).toBe(true);
    expect(rule.validate(25)).toBe(true);
  });
});

describe('useFormValidation hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues: { name: 'John', email: 'john@test.com' },
        validationRules: {
          name: [validationRules.required('Name is required')],
          email: [validationRules.required('Email is required'), validationRules.email('Invalid email')],
        },
        onSubmit: vi.fn(),
      })
    );

    expect(result.current.values).toEqual({ name: 'John', email: 'john@test.com' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('should validate on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues: { email: '' },
        validationRules: {
          email: [validationRules.required('Email is required'), validationRules.email('Invalid email')],
        },
        onSubmit: vi.fn(),
      })
    );

    // Simulate blur on email field
    act(() => {
      result.current.handleBlur('email')();
    });

    expect(result.current.touched).toEqual({ email: true });
    expect(result.current.errors).toEqual({ email: 'Email is required' });
    expect(result.current.isValid).toBe(false);
  });

  it('should handle valid form submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useFormValidation({
        initialValues: { email: 'test@test.com' },
        validationRules: {
          email: [validationRules.required('Email is required'), validationRules.email('Invalid email')],
        },
        onSubmit,
      })
    );

    // Fill in valid email
    act(() => {
      result.current.handleChange('email')('test@test.com');
      result.current.handleBlur('email')();
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);

    // Submit form
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as React.FormEvent);
    });

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(result.current.isSubmitting).toBe(false);
  });
});