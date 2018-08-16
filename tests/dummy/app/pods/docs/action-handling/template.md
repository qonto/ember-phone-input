# Action handling

`ember-phone-input` aims to be maximally flexible and because of that it doesn't try to make strong assumptions about how you want to use it. Instead it embraces DDAU (Data Down Actions Up) philosophy of Ember 2.0 so data flow always is unidirectional and explicit. 

Data changes that occur in the component are not propagated to the outside using two-way bindings, but rather they are communicated via the update action.

## `update` action

{{docs/components/phone-input/action-handling}}
