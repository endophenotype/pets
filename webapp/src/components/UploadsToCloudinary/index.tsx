/* eslint-disable @typescript-eslint/no-explicit-any */
import { type CloudinaryUploadPresetName, type CloudinaryUploadTypeName } from '@pets/shared/src/cloudinary'
import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useRef, useState } from 'react'

import { Button } from '../Button'
import { ReorderablePreviews } from '../ReorderablePreviews'
import { useUploadToCloudinary } from '../UploadToCloudinary'

import css from './index.module.scss'

export const UploadsToCloudinary = <TTypeName extends CloudinaryUploadTypeName>({
  label,
  name,
  formik,
  type,
  preset,
}: {
  label: string
  name: string
  formik: FormikProps<any>
  type: TTypeName
  preset: CloudinaryUploadPresetName<TTypeName>
}) => {
  const value = (formik.values[name] || []) as string[]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToCloudinary } = useUploadToCloudinary(type)

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <input
        className={css.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="image/*"
        multiple
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true)
            try {
              if (files?.length) {
                const newValue = [...value]
                await Promise.all(
                  Array.from(files).map(async (file) => {
                    await uploadToCloudinary(file).then(({ publicId }) => {
                      newValue.push(publicId)
                    })
                  })
                )
                void formik.setFieldValue(name, newValue)
              }
            } catch (err: any) {
              formik.setFieldError(name, err.message)
            } finally {
              void formik.setFieldTouched(name, true, false)
              setLoading(false)
              if (inputEl.current) {
                inputEl.current.value = ''
              }
            }
          })()
        }}
      />
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      {!!value?.length && (
        <ReorderablePreviews
          type={type}
          preset={preset}
          value={value}
          onDelete={(publicId) => {
            void formik.setFieldValue(
              name,
              value.filter((deletedPublicId) => deletedPublicId !== publicId)
            )
          }}
          onReorder={(newValue) => {
            void formik.setFieldValue(name, newValue)
          }}
        />
      )}
      <div className={css.button}>
        <Button
          type="button"
          onClick={() => inputEl.current?.click()}
          loading={loading}
          disabled={loading || disabled}
          color="green"
        >
          {value?.length ? 'Загрузить ещё' : 'Загрузить'}
        </Button>
      </div>
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
