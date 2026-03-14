/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUpdatePrivacyPoliciesMutation } from "@/lib/redux/api/dashboardWriteApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "align",
  "link",
];

export default function PrivacyPolicyClient() {
  const [updatePolicies, { isLoading: isSaving }] =
    useUpdatePrivacyPoliciesMutation();

  const [privacy, setPrivacy] = useState(
    `<h2><strong>1.&nbsp;Overview</strong></h2><p></p><p><strong>WALKING&nbsp;WITNESS</strong>&nbsp;is&nbsp;a&nbsp;nonprofit&nbsp;mobile&nbsp;application&nbsp;designed&nbsp;to&nbsp;support&nbsp;the&nbsp;mission&nbsp;of&nbsp;</p><p>its&nbsp;parent&nbsp;NGO,&nbsp;<strong>BRIDGES&nbsp;OF&nbsp;GLORY&nbsp;INTERNATIONAL</strong>,&nbsp;by&nbsp;enabling&nbsp;users&nbsp;to&nbsp;engage&nbsp;</p><p>with&nbsp;its&nbsp;content,&nbsp;activities,&nbsp;and&nbsp;causes.&nbsp;The&nbsp;app&nbsp;allows&nbsp;users&nbsp;to&nbsp;learn&nbsp;about&nbsp;the&nbsp;organization’s&nbsp;</p><p>initiatives,&nbsp;participate&nbsp;in&nbsp;community&nbsp;actions,&nbsp;and&nbsp;contribute&nbsp;financially&nbsp;through&nbsp;secure&nbsp;</p><p>donation&nbsp;options.&nbsp;Donations&nbsp;are&nbsp;facilitated&nbsp;through&nbsp;trusted&nbsp;third-party&nbsp;payment&nbsp;platforms&nbsp;</p><p>including&nbsp;PayPal&nbsp;and&nbsp;Swipe.</p><p></p><p>This&nbsp;privacy&nbsp;report&nbsp;outlines&nbsp;how&nbsp;user&nbsp;data&nbsp;is&nbsp;collected,&nbsp;used,&nbsp;protected,&nbsp;and&nbsp;shared&nbsp;within&nbsp;the&nbsp;</p><p>WALKING&nbsp;WITNESS&nbsp;application.</p><p></p><h2><strong>2.&nbsp;Data&nbsp;Collection</strong></h2><p></p><p>WALKING&nbsp;WITNESS&nbsp;collects&nbsp;limited&nbsp;personal&nbsp;information&nbsp;to&nbsp;operate&nbsp;effectively&nbsp;and&nbsp;</p><p>ensure&nbsp;a&nbsp;secure&nbsp;and&nbsp;meaningful&nbsp;user&nbsp;experience.&nbsp;The&nbsp;app&nbsp;may&nbsp;collect&nbsp;the&nbsp;following&nbsp;</p><p>categories&nbsp;of&nbsp;information:</p><p></p><h3><strong>2.1&nbsp;Personal&nbsp;Information</strong></h3><p></p><ul><li>Name&nbsp;(if&nbsp;voluntarily&nbsp;provided)</li><li>Email&nbsp;address</li><li>Donation&nbsp;details&nbsp;when&nbsp;making&nbsp;a&nbsp;contribution</li><li>Optional&nbsp;user&nbsp;profile&nbsp;information</li></ul><p></p><h3><strong>2.2&nbsp;Device&nbsp;and&nbsp;Usage&nbsp;Data</strong></h3><p></p><ul><li>Device&nbsp;type&nbsp;and&nbsp;operating&nbsp;system</li><li>App&nbsp;usage&nbsp;statistics</li><li>IP&nbsp;address&nbsp;and&nbsp;general&nbsp;location&nbsp;data</li><li>Crash&nbsp;logs&nbsp;and&nbsp;performance&nbsp;analytics</li></ul><p></p><h3><strong>2.3&nbsp;Payment&nbsp;Information&nbsp;</strong></h3><p></p><p>When&nbsp;users&nbsp;choose&nbsp;to&nbsp;donate&nbsp;through&nbsp;the&nbsp;app,&nbsp;payments&nbsp;are&nbsp;processed&nbsp;through&nbsp;third-party&nbsp;</p><p>providers&nbsp;such&nbsp;as&nbsp;<strong>PayPal</strong>&nbsp;and&nbsp;<strong>Swipe</strong>.&nbsp;WALKING&nbsp;WITNESS&nbsp;does&nbsp;not&nbsp;store&nbsp;full&nbsp;financial&nbsp;</p><p>information&nbsp;such&nbsp;as&nbsp;credit&nbsp;card&nbsp;numbers&nbsp;or&nbsp;bank&nbsp;details.&nbsp;Payment&nbsp;processors&nbsp;handle&nbsp;this&nbsp;</p><p>data&nbsp;according&nbsp;to&nbsp;their&nbsp;own&nbsp;privacy&nbsp;and&nbsp;security&nbsp;policies</p><p></p><h2><strong>3.&nbsp;Purpose&nbsp;of&nbsp;Data&nbsp;Collection</strong></h2><p></p><p>WALKING&nbsp;WITNESS&nbsp;collects&nbsp;data&nbsp;for&nbsp;the&nbsp;following&nbsp;purposes:&nbsp;</p><p></p><ul><li>To&nbsp;process&nbsp;and&nbsp;confirm&nbsp;donations</li><li>To&nbsp;communicate&nbsp;with&nbsp;users&nbsp;about&nbsp;NGO&nbsp;initiatives&nbsp;and&nbsp;updates</li><li>To&nbsp;improve&nbsp;app&nbsp;functionality&nbsp;and&nbsp;user&nbsp;experience</li><li>To&nbsp;maintain&nbsp;security&nbsp;and&nbsp;prevent&nbsp;fraud</li><li>To&nbsp;generate&nbsp;anonymous&nbsp;analytics&nbsp;that&nbsp;help&nbsp;improve&nbsp;program&nbsp;impact</li></ul><p></p><h2><strong>4.&nbsp;Data&nbsp;Sharing&nbsp;and&nbsp;Third&nbsp;Parties</strong></h2><p></p><p>WALKING&nbsp;WITNESS&nbsp;respects&nbsp;user&nbsp;privacy&nbsp;and&nbsp;does&nbsp;not&nbsp;sell&nbsp;or&nbsp;rent&nbsp;personal&nbsp;data.</p><p>However,&nbsp;information&nbsp;may&nbsp;be&nbsp;shared&nbsp;with&nbsp;trusted&nbsp;third&nbsp;parties&nbsp;for&nbsp;essential&nbsp;services:</p><p></p><ul><li><strong>Payment&nbsp;Processing:</strong>&nbsp;PayPal&nbsp;and&nbsp;Swipe&nbsp;for&nbsp;secure&nbsp;donation&nbsp;processing</li><li><strong>Analytics&nbsp;Providers:</strong>&nbsp;To&nbsp;monitor&nbsp;app&nbsp;performance&nbsp;and&nbsp;usage&nbsp;trends</li><li><strong>Cloud&nbsp;Infrastructure&nbsp;Providers:</strong>&nbsp;For&nbsp;secure&nbsp;storage&nbsp;and&nbsp;app&nbsp;functionality</li></ul><p></p><h2><strong>5.&nbsp;Data&nbsp;Security</strong></h2><p></p><p>WALKING&nbsp;WITNESS&nbsp;implements&nbsp;industry-standard&nbsp;security&nbsp;measures&nbsp;to&nbsp;protect&nbsp;user&nbsp;data,&nbsp;</p><p>including:</p><p></p><ul><li>Encrypted&nbsp;data&nbsp;transmission&nbsp;(HTTPS/SSL)</li><li>Secure&nbsp;authentication&nbsp;mechanisms</li><li>Restricted&nbsp;administrative&nbsp;access</li><li>Secure&nbsp;cloud&nbsp;storage&nbsp;environment</li></ul><p></p><p>These&nbsp;measures&nbsp;help&nbsp;protect&nbsp;against&nbsp;unauthorized&nbsp;access,&nbsp;disclosure,&nbsp;or&nbsp;alteration&nbsp;of&nbsp;personal&nbsp;information.</p><p></p><h2><strong>6.&nbsp;User&nbsp;Rights&nbsp;and&nbsp;Controls</strong></h2><p></p><p>Users&nbsp;maintain&nbsp;control&nbsp;over&nbsp;their&nbsp;personal&nbsp;data.&nbsp;Depending&nbsp;on&nbsp;applicable&nbsp;laws,&nbsp;users&nbsp;may&nbsp;</p><p>have&nbsp;the&nbsp;right&nbsp;to:</p><p></p><ul><li>&nbsp;Request&nbsp;access&nbsp;to&nbsp;personal&nbsp;data</li><li>Request&nbsp;correction&nbsp;of&nbsp;inaccurate&nbsp;information</li><li>&nbsp;Request&nbsp;deletion&nbsp;of&nbsp;their&nbsp;data</li><li>Opt&nbsp;out&nbsp;of&nbsp;communications&nbsp;from&nbsp;the&nbsp;NGO</li></ul><p></p><p>Requests&nbsp;can&nbsp;be&nbsp;made&nbsp;through&nbsp;the&nbsp;app’s&nbsp;support&nbsp;or&nbsp;contact&nbsp;channels.</p><p></p><h2><strong>7.&nbsp;Data&nbsp;Retention</strong></h2><p></p><p>WALKING&nbsp;WITNESS&nbsp;retains&nbsp;user&nbsp;data&nbsp;only&nbsp;as&nbsp;long&nbsp;as&nbsp;necessary&nbsp;to&nbsp;fulfill&nbsp;the&nbsp;purposes&nbsp;</p><p>outlined&nbsp;in&nbsp;this&nbsp;report,&nbsp;including&nbsp;legal&nbsp;and&nbsp;financial&nbsp;record-keeping&nbsp;requirements&nbsp;for&nbsp;</p><p>donations.</p><p></p><h2><strong>8.&nbsp;Children&#39;s&nbsp;Privacy</strong></h2><p></p><p>WALKING&nbsp;WITNESS&nbsp;is&nbsp;not&nbsp;intended&nbsp;for&nbsp;children&nbsp;under&nbsp;the&nbsp;age&nbsp;of&nbsp;13&nbsp;(or&nbsp;the&nbsp;applicable&nbsp;</p><p>minimum&nbsp;age&nbsp;in&nbsp;a&nbsp;given&nbsp;jurisdiction).&nbsp;The&nbsp;organization&nbsp;does&nbsp;not&nbsp;knowingly&nbsp;collect&nbsp;personal&nbsp;</p><p>information&nbsp;from&nbsp;minors&nbsp;without&nbsp;appropriate&nbsp;consent.</p><p></p><h2><strong>9.&nbsp;Updates&nbsp;to&nbsp;This&nbsp;Privacy&nbsp;Report</strong></h2><p></p><p>This&nbsp;privacy&nbsp;report&nbsp;may&nbsp;be&nbsp;updated&nbsp;periodically&nbsp;to&nbsp;reflect&nbsp;changes&nbsp;in&nbsp;the&nbsp;application,&nbsp;legal&nbsp;</p><p>requirements,&nbsp;or&nbsp;privacy&nbsp;practices.&nbsp;Users&nbsp;will&nbsp;be&nbsp;notified&nbsp;of&nbsp;significant&nbsp;changes&nbsp;through&nbsp;the&nbsp;</p><p>app&nbsp;or&nbsp;official&nbsp;communication&nbsp;channels.&nbsp;</p><p></p><h2><strong>9.&nbsp;&nbsp;Contact&nbsp;Information</strong></h2><p></p><p>For&nbsp;questions&nbsp;regarding&nbsp;privacy&nbsp;or&nbsp;data&nbsp;protection,&nbsp;users&nbsp;can&nbsp;contact&nbsp;us&nbsp;through&nbsp;its&nbsp;official&nbsp;</p><p>communication&nbsp;channels:</p><p></p><p><strong>Email:</strong>&nbsp;<u style="color: rgb(0, 102, 204);">info@walkingwitness.org</u></p><p><strong>Phone:</strong>&nbsp;+1&nbsp;(650)&nbsp;640-3229</p>`,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stripped = privacy.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      toast.error("Please enter privacy policy content");
      return;
    }
    console.log(privacy);
    try {
      await updatePolicies({ privacy }).unwrap();
      toast.success("Privacy policy saved");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save privacy policy");
    }
  };

  return (
    <>
      <style>{`
        .ql-toolbar.ql-snow { border-radius: 8px 8px 0 0; background: #f9fafb; }
        .ql-container.ql-snow { border-radius: 0 0 8px 8px; font-size: 14px; }
        .ql-editor { min-height: 300px; }
        .ql-editor.ql-blank::before { color: #9ca3af; font-style: normal; }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ReactQuill
          theme="snow"
          value={privacy}
          onChange={setPrivacy}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          placeholder="Write your privacy policy here…"
        />

        <Button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          {isSaving ? "Saving..." : "Save Privacy Policy"}
        </Button>
      </form>
    </>
  );
}
