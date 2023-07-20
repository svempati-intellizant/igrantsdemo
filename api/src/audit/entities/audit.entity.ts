import { Prop, Schema } from "@nestjs/mongoose";

import { Schema as MongooseSchema } from "mongoose";

@Schema({
  timestamps: true,
})
export class Audit {
  @Prop({
    type: MongooseSchema.Types.String,
  })
  dbkey: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_year: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_period: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  ein: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  duns: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grantee_name: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  low_risk_grantee: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  related_federal_agencies: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  cfda_prefix: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  cfda_extension: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  rd: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_id: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  multiple_grantors: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_name: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_group: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_expended: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  direct_award: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  major_program: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  type_of_audit_report: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_finding_id: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  finding_ref_no: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  type_of_audit_compliance_requirements: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  modified_opinion: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  other_non_compliance: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  material_weakness: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  significant_deficiency: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  other_findings: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  qcosts: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  repeat_finding: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  prior_finding_ref_no: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_findings: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  ofs_report_id: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  opinion_on_financial_statements: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  oaf_report_id: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_finding_title: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  opinion_on_audit_findings: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  payroll_costs__of_overall_costs: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_finding_ref_no: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  audit_finding_type: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  agrees: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  cap_report_id: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  corrective_action_plan_title: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  type: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  repeat: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  material: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  qc: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  significant: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  corrective_action_plan: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  action_due_date: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  action_status: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  action_completed_date: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_string: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_from_date: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_to_date: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_authorized: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grant_receipts: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grantee_share: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  grantee_expenditures: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  sub_recipients_expenditures: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  agency_name: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  agency_type: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  no_of_sub_recipients: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  sub_recipient_name: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  sub_recipient_grant: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  sub_recipients_share: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  subrecipient: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  subaward_id: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  subaward_title: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  sub_award_amount: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  ein__tin: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  single_audit_report: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  inactive_grants: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  other_grants: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  response: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  passthrough_agency_remarks: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  payroll_costs: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  project_start_date: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  project_end_date: string;
  @Prop({
    type: MongooseSchema.Types.String,
  })
  own_funds: string;
}
