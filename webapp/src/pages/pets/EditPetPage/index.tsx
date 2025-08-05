import { zUpdatePetTrpcInput } from '@pets/backend/src/router/pets/updatePet/input'
import { canEditPet } from '@pets/backend/src/utils/can'
import { useNavigate } from 'react-router-dom'

import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditPetRoute, getViewPetRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const EditPetPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { nick } = getEditPetRoute.useParams()
    return trpc.getPet.useQuery({
      nick,
    })
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const pet = checkExists(queryResult.data.pet, 'Pet not found')
    checkAccess(canEditPet(ctx.me, pet), 'An pet can only be edited by the author')
    return {
      pet,
    }
  },
  title: ({ pet }) => `Edit Pet "${pet.name}"`,
})(({ pet }) => {
  const navigate = useNavigate()
  const updatePet = trpc.updatePet.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: pet.name,
      nick: pet.nick,
      text: pet.text,
      images: pet.images,
      price: pet.price ?? '',
      groupLink: pet.groupLink ?? '',
      contactLink: pet.contactLink ?? '',
    },
    validationSchema: zUpdatePetTrpcInput.omit({ petId: true }),
    onSubmit: async (values) => {
      await updatePet.mutateAsync({ petId: pet.id, ...values })
      navigate(getViewPetRoute({ nick: values.nick }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <Segment title={`Edit Pet: ${pet.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Nick" name="nick" formik={formik} />
          <Textarea label="Text" name="text" formik={formik} />
          <Textarea label="Price" name="price" formik={formik} />
          <Input label="Ссылка для связи" name="contactLink" formik={formik} />
          <Input label="Ссылка на группу (опционально)" name="groupLink" formik={formik} />
          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Update Pet</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
