import { lazy, Suspense } from 'react'
import { HeadProvider } from 'react-head'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AdminRoute } from './components/AdminRoute'
import { Layout } from './components/Layout'
import { Loader } from './components/Loader'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { AppContextProvider } from './lib/ctx'
import { MixpanelUser } from './lib/mixpanel'
import * as routes from './lib/routes'
import { SentryUser } from './lib/sentry'
import { TrpcProvider } from './lib/trpc'
import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignOutPage } from './pages/auth/SignOutPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { NotFoundPage } from './pages/other/NotFoundPage'
import { StaticPage } from './pages/other/StaticPage'
import { AllPetsPage } from './pages/pets/AllPetsPage'
import { EditPetPage } from './pages/pets/EditPetPage'
import { NewPetPage } from './pages/pets/NewPetPage'
import { ViewPetPage } from './pages/pets/ViewPetPage'
import './styles/global.scss'

const AdminBannersPage = lazy(() =>
  import('./pages/admin/AdminBannersPage').then((m) => ({ default: m.AdminBannersPage }))
)
const AdminStaticPages = lazy(() =>
  import('./pages/admin/AdminStaticPages').then((m) => ({ default: m.AdminStaticPages }))
)
const ReorderPetsPage = lazy(() =>
  import('./pages/admin/ReorderPetsPage').then((m) => ({ default: m.ReorderPetsPage }))
)
const BlockedPetsPage = lazy(() => import('./pages/pets/BlockedPetsPage').then((m) => ({ default: m.BlockedPetsPage })))
const PendingPetsPage = lazy(() => import('./pages/pets/PendingPetsPage').then((m) => ({ default: m.PendingPetsPage })))
const ApprovedPetsPage = lazy(() =>
  import('./pages/pets/ApprovedPetsPage').then((m) => ({ default: m.ApprovedPetsPage }))
)

export const App = () => {
  return (
    <HeadProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <SentryUser />
            <MixpanelUser />
            <NotAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getAllPetsRoute.definition} element={<AllPetsPage />} />
                <Route path={routes.getViewPetRoute.definition} element={<ViewPetPage />} />
                <Route path={routes.getEditPetRoute.definition} element={<EditPetPage />} />
                <Route path={routes.getNewPetRoute.definition} element={<NewPetPage />} />
                <Route path={routes.getStaticPageRoute.definition} element={<StaticPage />} />
                <Route
                  element={
                    <Suspense fallback={<Loader type="page" />}>
                      <AdminRoute />
                    </Suspense>
                  }
                >
                  <Route path={routes.getBlockedPetsRoute.definition} element={<BlockedPetsPage />} />
                  <Route path={routes.getPendingPetsRoute.definition} element={<PendingPetsPage />} />
                  <Route path={routes.getApprovedPetsRoute.definition} element={<ApprovedPetsPage />} />
                  <Route path={routes.getAdminStaticPagesRoute.definition} element={<AdminStaticPages />} />
                  <Route path={routes.getReorderPetsRoute.definition} element={<ReorderPetsPage />} />
                  <Route path={routes.getAdminBannersRoute.definition} element={<AdminBannersPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HeadProvider>
  )
}
