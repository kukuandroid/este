// @flow
import type { meQueryResponse } from './__generated__/meQuery.graphql';
import Image from '../components/Image';
import P from '../components/P';
import Page from '../components/Page';
import Set from '../components/Set';
import app from '../components/app';
import gravatar from 'gravatar';
import sitemap from '../lib/sitemap';
import { SignOutButton } from '../components/buttons';
import { graphql } from 'react-relay';
import { serialize as serializeCookie } from 'cookie';

const deleteCookie = () => {
  // eslint-disable-next-line no-undef
  document.cookie = serializeCookie('token', '', {
    // Expire the cookie immediately.
    maxAge: -1,
  });
};

export const signOut = () => {
  deleteCookie();
  // Force full reload. Purging Relay environment and Redux store is not enough.
  // Sensitive session data can be stored in NEXT_PROPS or elsewhere.
  // eslint-disable-next-line no-undef
  location.href = '/';
};

const getGravatarUrl = email =>
  gravatar.url(email, {
    d: 'retro',
    protocol: 'https',
    r: 'x',
    s: '100',
  });

const Me = ({ data, intl }) => {
  // Force type via any cast. Can we do it better?
  const { viewer: { user } } = ((data: any): meQueryResponse);
  if (!user) return null;
  return (
    <Page title={intl.formatMessage(sitemap.me.title)}>
      <P bold>
        {user.email}
      </P>
      <Image
        marginBottom={1}
        size={{ height: 100, width: 100 }}
        src={getGravatarUrl(user.email)}
        title={user.email}
      />
      <Set>
        <SignOutButton danger onPress={signOut} />
      </Set>
    </Page>
  );
};

export default app(Me, {
  requireAuth: true,
  fetch: graphql`
    query meQuery {
      viewer {
        user {
          email
        }
      }
    }
  `,
});
