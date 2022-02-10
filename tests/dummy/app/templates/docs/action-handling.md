# Action handling

`ember-phone-input` aims to be maximally flexible and because of that it doesn't try to make strong assumptions about how you want to use it. Instead it embraces DDAU (Data Down Actions Up) philosophy of Ember 2.0 so data flow always is unidirectional and explicit.

Data changes that occur in the component are not propagated to the outside using two-way bindings, but rather they are communicated via the update action.

Note that `ember-phone-input` can function without the `intl-tel-input` &
`libphonenumber` scripts being loaded, in case if they load slowly or fail
completely, but the user began interacting with the component. In both cases the
`<input>` field's value as `number` and an empty `metaData` object is sent as
`update` action arguments. If the scripts are loaded later, the component will
proceed to initializing the scripts, keeping the value already entered.

## `update` action

{{docs/components/phone-input/action-handling}}
