import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import * as request from "request";
import * as path from "path";
import * as _ from "lodash";
import { AuditRepository } from "./audit.repository";
import { GranteeMasterService } from "src/grantee-master/grantee-master.service";
import { GrantMasterService } from "src/grant-master/grant-master.service";
import { GranteeGrantService } from "src/grantee-grant/grantee-grant.service";

@Injectable()
export class AuditService {
  constructor(
    private readonly auditRepository: AuditRepository,
    private readonly granteeMasterSerivce: GranteeMasterService,
    private readonly grantMasterSerivce: GrantMasterService,
    private readonly granteeGrantService: GranteeGrantService
  ) {}
  create(createAuditDto: CreateAuditDto) {
    return "This action adds a new audit";
  }
  async manualUpload(file_details) {
    console.log(
      existsSync(
        `${path.join(
          process.env.AUDIT_FILE_PATH,
          file_details["originalname"]
        )}`
      )
    );
    if (
      !existsSync(
        `${path.join(
          process.env.AUDIT_FILE_PATH,
          file_details["originalname"]
        )}`
      )
    ) {
      if (!existsSync(process.env.AUDIT_FILE_PATH))
        mkdirSync(process.env.AUDIT_FILE_PATH, { recursive: true });
      writeFileSync(
        `${path.join(
          process.env.AUDIT_FILE_PATH,
          file_details["originalname"]
        )}`,
        file_details["buffer"],
        {
          encoding: "utf8",
        }
      );
    }
    const details = {
      file_path: `${path.join(
        process.env.AUDIT_FILE_PATH,
        file_details["originalname"]
      )}`,
    };
    request.post(
      {
        url: "http://0.0.0.0:8088/single-audit-save",
        body: details,
        json: true,
        timeout: 7200000,
      },
      (error, response, body) => {
        if (error || response.statusCode === 500) {
          if (response)
            throw new HttpException(
              response.body,
              HttpStatus.INTERNAL_SERVER_ERROR
            );
        } else {
          return body;
        }
      }
    );
    return {
      error: false,
      message: "Document has been Uploaded",
    };
  }

  async pushDummy(json_file_upload) {
    const data = JSON.parse(
      json_file_upload[0]["buffer"].toString().replace(/'/g, '"')
    );
    const singleAuditFileData = data["data"].map((ele) => {
      const obj = Object.keys(ele).reduce(function(result, key) {
        var keyTrimmed = _.trim(key)
            .toLowerCase()
            .split(" ")
            .join("_")
            .replace(/[/.%&']/g, ""),
          valTrimmed = ele[key];
        result[keyTrimmed] = valTrimmed;
        return result;
      }, {});
      return obj;
    });

    const grantee_details = _.uniqBy(singleAuditFileData, "grantee_name");
    const grantee_master = await Promise.all(
      grantee_details
        .map((ele) => {
          if (
            ele["grantee_name"] &&
            ele["grant_name"] &&
            ele["ein"] &&
            ele["grant_authorized"] &&
            ele["grant_id"]
          )
            return this.granteeMasterSerivce.pushGranteeFromSAF(ele);
        })
        .filter(Boolean)
    );

    const grant_details = _.uniqBy(singleAuditFileData, "grant_id");
    const grant_master = await Promise.all(
      grant_details
        .map((ele) => {
          // console.log(ele);
          if (
            ele["grantee_name"] &&
            ele["grant_name"] &&
            ele["ein"] &&
            ele["grant_authorized"] &&
            ele["grant_id"]
          )
            return this.grantMasterSerivce.pushGrantFromSAF(ele);
        })
        .filter(Boolean)
    );

    await Promise.all(
      grantee_details.map((ele) => {
        const filterGranteeMasterID = grantee_master.filter(
          (each_grantee) =>
            each_grantee.toObject().grantee_name === ele["grantee_name"]
        );
        if (filterGranteeMasterID.length) {
          const granteeWithObjectID = {
            ...ele,
            _id: filterGranteeMasterID[0]["_id"],
          };
          const grantAllocatedGrantee = grant_master.filter(
            (ele) =>
              ele.toObject().grant_name == granteeWithObjectID["grant_name"]
          );

          if (grantAllocatedGrantee.length) {
            return this.granteeGrantService.create({
              grantee_master_id: granteeWithObjectID["_id"],
              grant_master_id: grantAllocatedGrantee[0]["_id"],
            });
          }
        }
      })
    );

    return { error: false, message: "Record Created" };
  }

  findAll() {
    return `This action returns all audit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
