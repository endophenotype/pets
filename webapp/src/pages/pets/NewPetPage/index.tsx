import { zCreatePetTrpcInput } from '@pets/backend/src/router/pets/createPet/input'

import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
export const NewPetPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Pet',
})(() => {
  const createPet = trpc.createPet.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      text: '',
      images: [],
      price: '',
      groupLink: '',
      contactLink: '',
    },
    validationSchema: zCreatePetTrpcInput,
    onSubmit: async (values) => {
      await createPet.mutateAsync(values)
      formik.resetForm()
    },
    successMessage: 'Pet created!',
    showValidationAlert: true,
  })

  return (
    <Segment title="Добавить питомца">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Input name="name" label="Имя" formik={formik} />
          <Input name="nick" label="Nickname" formik={formik} />
          <Textarea name="text" label="Текст" formik={formik} />
          <Textarea name="price" label="Цена" formik={formik} />
          <Input name="contactLink" label="Ссылка для связи" formik={formik} />
          <Input name="groupLink" label="Ссылка на группу (опционально)" formik={formik} />
          <UploadsToCloudinary label="Добавить фото" name="images" type="image" preset="preview" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Добавить питомца</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
