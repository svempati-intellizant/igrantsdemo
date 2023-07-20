import { ObjectId } from "mongoose";

export class CreateGranteeGrantDto {
  grantee_master_id: ObjectId;
  grant_master_id: ObjectId;
}
