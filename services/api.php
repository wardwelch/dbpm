<?php
 	require_once("Rest.inc.php");

	class API extends REST {
		public $data = "";
		
		const DB_SERVER = "127.0.0.1";
		const DB_USER = "root";
		const DB_PASSWORD = "";
		const DB = "firestn_ci";
		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$email = $this->_request['email'];		
			$password = $this->_request['pwd'];
			if(!empty($email) and !empty($password)){
				if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
			$this->response($this->json($error), 400);
		}
		
		private function tenents(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT * from `tenents` t where t.building_id = $id order by t.`lastname` desc";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function tenent(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * from `tenents` t where t.tenent_id=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
// Building
		private function buildings(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from buildings";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function building(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * from buildings where building_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function insertBuilding(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$building = json_decode(file_get_contents("php://input"),true);
			$column_names = array('code', 'name', 'owner', 'street', 'city', 'state', 'zip', 'inactive', 'units');
			$keys = array_keys($building);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $building[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO buildings(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($building)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Building Created Successfully.", "data" => $building);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function updateBuilding(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$building = json_decode(file_get_contents("php://input"),true);
			$id = (int)$building['id'];
			$column_names = array('code', 'name', 'owner', 'street', 'city', 'state', 'zip', 'inactive', 'units');
			$keys = array_keys($building['building']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the building received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $building['building'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE buildings SET ".trim($columns,',')." WHERE building_id=$id";
			if(!empty($building)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Building ".$id." Updated Successfully.", "data" => $building);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteBuilding(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM buildings WHERE building_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
// units
		private function units(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT u.unit_id unit_id, unitnum, concat(lastname,', ',firstname) tenent, `type`, u.`status` status, price from units u LEFT JOIN  tenents t ON u.tenent_id = t.tenent_id where u.building_id = $id";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function unit(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * from units where unit_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function insertUnit(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$unit = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'tenent_id',  'unitnum', 'price', 'type', 'status');
			$keys = array_keys($unit);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $unit[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO units(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($unit)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Unit Created Successfully.", "data" => $unit);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function updateUnit(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$unit = json_decode(file_get_contents("php://input"),true);
			$id = (int)$unit['id'];
			$column_names = array('unit_id', 'building_id', 'tenent_id', 'building', 'unitnum', 'price', 'type', 'status', 'total_bal_due');
			$keys = array_keys($unit['unit']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the unit received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $unit['unit'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE units SET ".trim($columns,',')." WHERE unit_id=$id";
			if(!empty($unit)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Unit ".$id." Updated Successfully.", "data" => $unit);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteUnit(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM units WHERE unit_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>