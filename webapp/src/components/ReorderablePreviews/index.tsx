import {
  type CloudinaryUploadPresetName,
  type CloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@pets/shared/src/cloudinary'

import { Icon } from '../Icon'

import css from './index.module.scss'

export const ReorderablePreviews = <TTypeName extends CloudinaryUploadTypeName>({
  type,
  preset,
  value,
  onDelete,
  onReorder,
}: {
  type: TTypeName
  preset: CloudinaryUploadPresetName<TTypeName>
  value: string[]
  onDelete: (publicId: string) => void
  onReorder: (publicIds: string[]) => void
}) => {
  const move = (from: number, to: number) => {
    const newValue = [...value]
    const [item] = newValue.splice(from, 1)
    newValue.splice(to, 0, item)
    onReorder(newValue)
  }

  return (
    <div className={css.previews}>
      {value.map((publicId, index) => (
        <div key={publicId} className={css.previewPlace}>
          <button type="button" className={css.delete} onClick={() => onDelete(publicId)}>
            <Icon className={css.deleteIcon} name="delete" />
          </button>
          <div className={css.orderButtons}>
            <button
              type="button"
              className={css.orderButton}
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
            >
              <Icon className={css.orderIcon} name="arrowLeft" />
            </button>
            <button
              type="button"
              className={css.orderButton}
              disabled={index === value.length - 1}
              onClick={() => move(index, index + 1)}
            >
              <Icon className={css.orderIcon} name="arrowRight" />
            </button>
          </div>
          <img className={css.preview} alt="" src={getCloudinaryUploadUrl(publicId, type, preset)} />
        </div>
      ))}
    </div>
  )
}
