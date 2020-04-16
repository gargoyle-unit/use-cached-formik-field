import * as React from 'react';
import { Formik, FormikValues } from 'formik';
import { act, renderHook } from '@testing-library/react-hooks';

import { useCachedFormikField } from './use-cached-formik-field';

const createWrapper = (): React.FC => {
    const initialValues: FormikValues = {
        name: 'Name',
    };

    const handleSubmit = (): void => {
        console.warn('Submitting form...');
    };

    const Wrapper: React.FC = (props: { children?: React.ReactNode }): JSX.Element => {
        return (
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {props.children}
            </Formik>
        );
    };

    return Wrapper;
};

describe('the behaviour of useCachedFormikField', () => {
    const wrapper = createWrapper();

    it('expects the value to equal the initial value', () => {
        const { result } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    'Name',
                );
            },
            {
                wrapper,
            },
        );

        const [fieldInputProps] = result.current;

        expect(fieldInputProps.value).toEqual('Name');
    });

    it('expects new value when changing the value', async () => {
        const { result } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    'Name',
                    5,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('next value');
        });

        expect(result.current[0].value).toEqual('next value');
    });

    it('expects there to be an error', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    'Name',
                    1000,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('');
        });

        await waitForNextUpdate();

        expect(result.current[1].error).toEqual('Empty');
    });

    it('expects there to be the same value', async () => {
        const { result } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    'Name',
                    5,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('Name');
        });

        expect(result.current[1].value).toEqual('Name');
    });

    it('expects the debounce to trigger', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    'Name',
                    1000,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('');
        });

        await waitForNextUpdate();

        expect(result.current[0].value).toEqual('');
    });

    it('expects the cached error to be returned', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    'Name',
                    100,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('');
        });

        await waitForNextUpdate();

        act(() => {
            fieldHelperProps.setValue('');
        });

        expect(result.current[1].error).toEqual('Empty');
    });

    it('expects to receive a validation error', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (): string | void | Promise<string | void> => {
                            return Promise.reject('Validation error');
                        },
                    },
                    'Name',
                    1000,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('');
        });

        await waitForNextUpdate();

        expect(result.current[1].error).toEqual('Validation error');
    });

    it('triggers the initial values change', () => {
        let initialValue = 'Name';

        const { result, rerender } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    initialValue,
                );
            },
            {
                wrapper,
            },
        );

        initialValue = 'Changed';

        rerender();

        const [fieldInputProps] = result.current;

        expect(fieldInputProps.value).toEqual('Name');
    });

    it('triggers the initial value change while an error exists', async () => {
        let initialValue = 'Name';

        const { result, waitForNextUpdate, rerender } = renderHook(
            () => {
                return useCachedFormikField(
                    {
                        name: 'name',
                        validate: (value: any): string | void => {
                            if (!value) {
                                return 'Empty';
                            }
                        },
                    },
                    initialValue,
                    100,
                );
            },
            {
                wrapper,
            },
        );

        const [, , fieldHelperProps] = result.current;

        act(() => {
            fieldHelperProps.setValue('');
        });

        await waitForNextUpdate();

        initialValue = 'Changed';
        rerender();

        // act(() => {
        //     fieldHelperProps.setValue('');
        // });

        expect(result.current[1].error).toEqual('Empty');
    });
});
