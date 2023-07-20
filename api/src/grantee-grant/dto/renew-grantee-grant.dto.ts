import { ObjectId } from "mongoose";
import { RenewalSchema } from "../entities/renewal.entity";

export class RenewGrantDTO {
  grantee_grant_id: ObjectId;
  renewal_details: RenewalSchema;
}
