function mySettings(props) {
  return (
    <Page>
      <Section
        description={<Text>Add your Toggl Track account API token here so we can log you in</Text>}
        title={<Text bold align="center">Toggl Track Account</Text>}>
        <TextInput
          label="Api token"
          settingsKey="token"
          placeholder="token"
        />
      </Section>
      <Section
        description={<Text>Setup the default description that is used when you start timer from Tracks</Text>}
        title={<Text bold align="center">Preferences</Text>}>
        <TextInput
          label="Default Time entry description"
          settingsKey="description"
          placeholder="description"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
