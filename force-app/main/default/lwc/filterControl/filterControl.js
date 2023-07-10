import { LightningElement } from "lwc";
import { createMessageContext, releaseMessageContext, publish } from "lightning/messageService";
import MC_SET_PARAMETERS from "@salesforce/messageChannel/msmxSheet__setParameters__c";

export default class FilterControl extends LightningElement {
  messageContext;
  priceMin = undefined;
  priceMax = undefined 
	privatePlace = undefined;
  bedroomCount = undefined;
  bedCount = undefined;
  bathroomCount = undefined;
  propertyTypes = ["house", "apartment", "guesthouse", "hotel"];
  amenities = [];

  connectedCallback() {
    this.messageContext = createMessageContext();
  }

  disconnectedCallback() {
    if (this.messageContext) {
      releaseMessageContext(this.messageContext);
      this.messageContext = null;
    }
  }

  handleChangePriceMin(event) {
    this.priceMin = Number(event.target.value);
    if (this.priceMax != null && this.priceMax < this.priceMin) {
      this.priceMax = this.priceMin;
    }
    this._fireParameterChangeEvent();
  }

  handleChangePriceMax(event) {
    this.priceMax = Number(event.target.value);
    if (this.priceMin != null && this.priceMin > this.priceMax) {
      this.priceMin = this.priceMax;
    }
    this._fireParameterChangeEvent();
  }

  get isEntirePlaceType() {
    return this.privatePlace == null;
  }

  get isPrivatePlaceType() {
    return this.privatePlace === true;
  }

  handleClickEntirePlaceType() {
		this.privatePlace = undefined;
    this._fireParameterChangeEvent();
  }

  handleClickPrivatePlaceType() {
		this.privatePlace = true;
    this._fireParameterChangeEvent();
  }

  _createCountItems(count) {
    const items = [{ label: "Any", value: null, selected: count == null }];
    for (let i = 1; i <= 6; i++) {
      items.push({
        label: i === 6 ? `${i}+` : `${i}`,
        value: i,
        selected: count === i
      });
    }
    return items;
  }

  get bedroomCountItems() {
    return this._createCountItems(this.bedroomCount);
  }

  get bedCountItems() {
    return this._createCountItems(this.bedCount);
  }

  get bathroomCountItems() {
    return this._createCountItems(this.bathroomCount);
  }

  handleClickBedroomCount(event) {
    const itemCount = event.target.dataset.itemCount;
    this.bedroomCount = itemCount == null ? null : Number(itemCount);
    this._fireParameterChangeEvent();
  }

  handleClickBedCount(event) {
    const itemCount = event.target.dataset.itemCount;
    this.bedCount = itemCount == null ? null : Number(itemCount);
    this._fireParameterChangeEvent();
  }

  handleClickBathroomCount(event) {
    const itemCount = event.target.dataset.itemCount;
    this.bathroomCount = itemCount == null ? null : Number(itemCount);
    this._fireParameterChangeEvent();
  }

  _propertyOptions = [
    { label: "House", value: "house", icon: "utility:home" },
    { label: "Apartment", value: "apartment", icon: "utility:company" },
    { label: "Guesthouse", value: "guesthouse", icon: "utility:agent_home" },
    { label: "Hotel", value: "hotel", icon: "utility:your_account" }
  ];

  get propertyOptions() {
    return this._propertyOptions.map((option) => ({
      ...option,
      selected: this.propertyTypes.includes(option.value)
    }));
  }

  handleClickPropertyType(event) {
    const propertyType = event.currentTarget.dataset.value;
    if (this.propertyTypes.includes(propertyType)) {
      this.propertyTypes = this.propertyTypes.filter(
        (type) => type !== propertyType
      );
    } else {
      this.propertyTypes = [...this.propertyTypes, propertyType];
    }
    this._fireParameterChangeEvent();
  }

  _amenityOptions = [
    { label: "Wi-Fi", value: "Wi-Fi" },
    { label: "Washer", value: "Washer" },
    { label: "Air Conditioner", value: "Air Conditioner" },
    { label: "Kitchen", value: "Kitchen" },
    { label: "Dryer", value: "Dryer" },
    { label: "Heating", value: "Heating" },
    { label: "Dedicated Workspace", value: "Dedicated Workspace" },
    { label: "TV", value: "TV" },
    { label: "Iron", value: "Iron" }
  ];

  get amenityOptions() {
    return this._amenityOptions.map((option) => ({
      ...option,
      selected: this.amenities.includes(option.value)
    }));
  }

  handleClickAmenity(event) {
    const amenity = event.currentTarget.dataset.value;
    if (this.amenities.includes(amenity)) {
      this.amenities = this.amenities.filter((am) => am !== amenity);
    } else {
      this.amenities = [...this.amenities, amenity];
    }
    this._fireParameterChangeEvent();
  }

  _fireParameterChangeEvent() {
    const parameters = {
      priceMin: this.priceMin,
      priceMax: this.priceMax,
			privatePlace: this.privatePlace,
      bedroomCount: this.bedroomCount,
      bedCount: this.bedCount,
      bathroomCount: this.bathroomCount,
      propertyTypes: this.propertyTypes,
      amenities: this.amenities.length > 0 ? this.amenities : undefined 
    };
    console.log(JSON.stringify(parameters));
    publish(this.messageContext, MC_SET_PARAMETERS, { parameters });
  }
}
