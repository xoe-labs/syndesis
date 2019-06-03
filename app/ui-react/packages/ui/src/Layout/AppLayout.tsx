import accessibleStyles from '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import {
  Avatar,
  DropdownItem,
  DropdownSeparator,
  Nav,
  NavList,
  Page,
  PageHeader,
  PageSidebar,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import * as React from 'react';
import { HelpDropdown } from '../Shared/HelpDropdown';
import { AppLayoutContext } from './AppLayoutContext';
import { AppTopMenu } from './AppTopMenu';

export interface ILayoutBase {
  avatar?: string;
  pictograph: any;
  verticalNav: any[];
  logoHref: string;
  logoutItem: {
    key: string;
    onClick: () => Promise<any>;
    id: string;
    className?: string;
    children: string;
  };
  showNavigation: boolean;
  username: string;
  onNavigationCollapse(): void;
  onNavigationExpand(): void;
  onShowAboutModal(): void;
  onSelectSupport(): void;
  onSelectSampleIntegrationTutorials(): void;
  onSelectUserGuide(): void;
  onSelectConnectorsGuide(): void;
  onSelectContactUs(): void;
}

export const AppLayout: React.FunctionComponent<ILayoutBase> = ({
  avatar,
  pictograph,
  verticalNav,
  logoHref,
  showNavigation,
  logoutItem,
  onNavigationCollapse,
  onNavigationExpand,
  onShowAboutModal,
  onSelectSupport,
  onSelectConnectorsGuide,
  onSelectContactUs,
  onSelectSampleIntegrationTutorials,
  onSelectUserGuide,
  username,
  children,
}) => {
  const onNavToggle = showNavigation
    ? onNavigationCollapse
    : onNavigationExpand;

  const [breadcrumb, setHasBreadcrumb] = React.useState(null);
  const showBreadcrumb = (b: any) => setHasBreadcrumb(b);

  return (
    <AppLayoutContext.Provider
      value={{
        showBreadcrumb,
      }}
    >
      <Page
        header={
          <PageHeader
            logo={pictograph}
            logoProps={{ href: logoHref }}
            toolbar={
              <Toolbar>
                <ToolbarGroup
                  className={css(
                    accessibleStyles.screenReader,
                    accessibleStyles.visibleOnLg
                  )}
                >
                  <ToolbarItem>
                    <HelpDropdown
                      className="syn-help-dropdown"
                      isOpen={false}
                      launchSupportPage={onSelectSupport}
                      launchAboutModal={onShowAboutModal}
                      launchSampleIntegrationTutorials={
                        onSelectSampleIntegrationTutorials
                      }
                      launchConnectorsGuide={onSelectConnectorsGuide}
                      launchUserGuide={onSelectUserGuide}
                      launchContactUs={onSelectContactUs}
                      additionalDropdownItems={[
                        <DropdownSeparator
                          key="separator"
                          className="pf-u-display-none-on-lg"
                        />,
                        <DropdownItem
                          key={`mobile-${logoutItem.key}`}
                          onClick={logoutItem.onClick}
                        >
                          <button
                            type="button"
                            role="menuitem"
                            id={`mobile-${logoutItem.id}`}
                            data-testid={`mobile-${logoutItem.id}`}
                            className={`${
                              logoutItem.className
                            } pf-u-display-none-on-lg`}
                          >
                            {logoutItem.children}
                          </button>
                        </DropdownItem>,
                      ]}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem className="pf-u-display-none pf-u-display-block-on-lg">
                    <AppTopMenu username={username}>
                      <DropdownItem
                        key={logoutItem.key}
                        onClick={logoutItem.onClick}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          id={logoutItem.id}
                          data-testid={logoutItem.id}
                          className={logoutItem.className}
                        >
                          {logoutItem.children}
                        </button>
                      </DropdownItem>
                    </AppTopMenu>
                  </ToolbarItem>
                </ToolbarGroup>
              </Toolbar>
            }
            avatar={avatar && <Avatar src={avatar} alt="User Avatar" />}
            showNavToggle={true}
            isNavOpen={showNavigation}
            onNavToggle={onNavToggle}
          />
        }
        sidebar={
          <PageSidebar
            nav={
              <Nav>
                <NavList>{verticalNav}</NavList>
              </Nav>
            }
            isNavOpen={showNavigation}
          />
        }
        breadcrumb={breadcrumb}
      >
        {children}
      </Page>
    </AppLayoutContext.Provider>
  );
};
