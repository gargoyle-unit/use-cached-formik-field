import * as React from 'react';
import { useField } from 'formik';
import { FieldHookConfig } from 'formik/dist/Field';
import {
    FieldHelperProps,
    FieldInputProps,
    FieldMetaProps,
    FieldValidator,
} from 'formik/dist/types';
import { debounce } from 'ts-debounce';

export declare type CachedFieldHookConfig<Val = any> = FieldHookConfig<Val> & {
    validate: FieldValidator;
};

export const useCachedFormikField = <Val = any>(
    props: CachedFieldHookConfig<Val>,
    initialValue: any,
    debounceTimeout = 0,
): [FieldInputProps<Val>, FieldMetaProps<Val>, FieldHelperProps<Val>] => {
    const { validate, ...restProps } = props;
    const cachedValue = React.useRef<any>(initialValue);
    const cachedError = React.useRef<string | null>(null);

    const debounced = React.useRef(
        debounce(callback => {
            callback();
        }, debounceTimeout),
    );

    const validateField = (value: string): string | void | Promise<string | void> => {
        if (value === cachedValue.current) {
            if (cachedError.current) {
                return cachedError.current;
            }
        } else {
            cachedValue.current = value;

            const promise = new Promise<string | void>((resolve, reject) => {
                debounced.current(() => {
                    const result = validate(value);

                    Promise.resolve(result)
                        .then(resultValue => {
                            cachedError.current = !!resultValue ? resultValue : null;

                            resolve(resultValue);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            });

            return promise;
        }
    };

    const [fieldInputProps, fieldMetaProps, fieldHelperProps] = useField({
        ...restProps,
        validate: validateField,
    });

    return [fieldInputProps, fieldMetaProps, fieldHelperProps];
};
