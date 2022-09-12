import { actions as searchActions } from "./SearchContacts";
import { actions as contactDetailsActions } from "./ContactDetails";

export const updateSearchPhrase = newPhrase =>
  (dispatch, getState, { httpApi }) => {
    dispatch(
      searchActions.updateSearchPhraseStart({ newPhrase }),
    );
    httpApi.getFirst5MatchingContacts({ namePart: newPhrase })
      .then(({ data }) => {
        const matchingContacts = data.map(contact => ({
          id: contact.id,
          value: contact.name,
        }));
        dispatch(
          searchActions.updateSearchPhraseSuccess({ matchingContacts: matchingContacts }),
        );
      })
      .catch(() => {
        dispatch(
          contactDetailsActions.fetchContactDetailsFailure(),
        );
      });
  };

export const selectMatchingContact = selectedMatchingContact =>
  (dispatch, getState, { httpApi, dataCache }) => {
    // exp: id is contactId
    const getContactDetails = ({ id }) => {
      return httpApi
        .getContact({ contactId: id })
        .then(({ data }) => ({
          id: data.id,
          name: data.name,
          phone: data.phone,
          addressLines: data.addressLines,
        }));
    };

    dispatch(
      searchActions.selectMatchingContact({ selectedMatchingContact }),
    );

    dispatch(
      contactDetailsActions.fetchContactDetailsStart(),
    );

    getContactDetails({ id: selectedMatchingContact.id })
      .then((contactDetails) => {
        // TODO something is missing here
        dataCache.store({
          key: contactDetails.id,
        });

        // exp: dispatch success action instead of failure
        dispatch(
          contactDetailsActions.fetchContactDetailsSuccess({ contactDetails }),
        );
      })
      .catch(() => {
        dispatch(
          contactDetailsActions.fetchContactDetailsFailure(),
        );
      });
  };
