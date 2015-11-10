<?php
 	require_once("Rest.inc.php");

	class API extends REST {
		public $data = "";
        const DB_SERVER = "127.0.0.1";
        const DB_USER = "root";
        const DB_PASSWORD = "";
        const DB = "bents_test";
		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
/*		
		public $data = "";
		const DB_SERVER = "localhost";
		const DB_USER = "firestn_admin";
		const DB_PASSWORD = "V9evn4uR";
		const DB = "firestn_dbpm";
		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
*/

		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
		
		
		    if($_SERVER['SERVER_NAME'] == 'localhost'){
			    $this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);			
			}
		    if($_SERVER['SERVER_NAME'] == 'rodfirestone.com'){
		
			    $this->mysqli = new mysqli('localhost', 'firestn_admin', 'V9evn4uR', 'firestn_dbpm');
			
			}
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
		    
			$user = json_decode(file_get_contents("php://input"),true);
			$email = $user['email'];
			$password = $user['pwd'];

// 			$email = $this->_request['email'];
//             $password = $this->_request['pwd'];


			if(!empty($email) and !empty($password)){
				if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT id, username, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
					if($r->num_rows > 0) {
					    $result = $r->fetch_assoc();
					    
						// If success everything is good send header as "OK" and user details
						
                        if (!isset($_SESSION)) {
                            session_start();
                        }
                        $_SESSION['id'] = $result['id'];
                        $_SESSION['email'] = $email;
                        $_SESSION['username'] = $result['username'];
				        $success = array('status' => "Success", "msg" => "Login Successfull", "data" => $result);
				        $this->response($this->json($success),200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email or Password");
			$this->response($this->json($error), 400);
		}

        public function getSession(){
            if (!isset($_SESSION)) {
                session_start();
            }
            $sess = array();
            if(isset($_SESSION['id']))
            {
                $sess["id"] = $_SESSION['id'];
                $sess["username"] = $_SESSION['username'];
                $sess["email"] = $_SESSION['email'];
            }
            else
            {
                $sess["id"] = '';
                $sess["username"] = 'Guest';
                $sess["email"] = '';
            }
            $this->response($this->json($_SESSION), 200);
        }
        public function destroySession(){
            if (!isset($_SESSION)) {
            session_start();
            }
            if(isSet($_SESSION['id']))
            {
                unset($_SESSION['id']);
                unset($_SESSION['username']);
                unset($_SESSION['email']);
                $info='info';
                if(isSet($_COOKIE[$info]))
                {
                    setcookie ($info, '', time() - $cookie_time);
                }
                $txt="Logged Out Successfully...";
            }
            else
            {
                $txt = "Not logged in...";
            }
            $msg = array('message'=>$txt);
            $this->response($this->json($msg), 200);
        }

//tickets	
	
		private function tickets(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from tickets";
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
//buildings	
	
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
		
		private function buildingsList(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT building_id id, code, name from buildings where inactive = '0'";
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
		
		private function unitsList(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			
			$query="SELECT unit_id id, unitnum, unitid from units where building_id = $id order by unitnum asc";
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
		
		
		private function addBuilding($arr){
			$building = array(
			"building_id"=> 1,
			"code"=> 10,
			"name"=> "1749 10th Street",
			"street"=> "1749 10th Street",
			"city"=> "Santa Monica",
			"state"=> "",
			"zip"=> "27516",
			"owner"=> "CRAIG & DAVE BENTZ",
			"units"=> 9,
			"inactive"=> 0
		);

			$column_names = array('code', 'name', 'owner', 'street', 'city', 'state', 'zip', 'inactive', 'units');
			$keys = array_keys($building);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $this->mysqli->real_escape_string($building[$desired_key]);
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO buildings(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			}else
				$this->response('',204);	//"No Content" status
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

//tenants

		private function tenants(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT * from tenants t where t.building_id = $id order by t.unitid asc";
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
		
		private function tenant(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT t.*, u.unitnum, u.building from tenants t LEFT JOIN units u ON t.tenant_id = u.tenant_id where t.tenant_id=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function tenantsList(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
			$query="SELECT tenant_id, firstname, lastname from tenants where unit_id = $id order by lastname asc";
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
		

// rents
		private function rents(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT  r.* , concat(lastname,', ',firstname) tenant , move_in, move_out, balance_due, note from rents r LEFT JOIN  tenants t ON r.tenant_id = t.tenant_id where r.building_id = $id order by unitid asc";
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

		private function tenant_rents(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT  r.* , concat(lastname,', ',firstname) tenant from rents r LEFT JOIN  tenants t ON r.tenant_id = t.tenant_id where r.tenant_id = $id order by r.sort_month desc";
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

		private function unit_rents(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $uid = (int)$this->_request['uid'];
		    
		    	
			
			if($uid > 0){				
			    $query="SELECT  r.* , concat(lastname,', ',firstname) tenant, move_in, move_out from rents r LEFT JOIN  tenants t ON r.tenant_id = t.tenant_id where r.unit_id = $uid order by r.sort_month asc";
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
		private function rent(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT r.* , concat(lastname,', ',firstname) tenant from rents r LEFT JOIN  tenants t ON r.tenant_id = t.tenant_id where rent_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
        private function getRentsByDateRange(){
        
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $bid = (int)$this->_request['id'];
		    $uid = (int)$this->_request['unit'];
		    $d1 = $this->_request['d1'];
		    $d2 = $this->_request['d2'];

			if($bid > 0){	
			    $query="SELECT r.* , concat(lastname,', ',firstname) , move_in tenant from rents r LEFT JOIN  tenants t ON r.tenant_id = t.tenant_id where r.building_id = '$bid' and r.unit_id = '$uid' and (date_paid BETWEEN '$d1' AND '$d2') order by date_paid desc, unitid asc";
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
		
		
		
        private function getRentsByMonth(){
        
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    $m = $this->_request['month'];
		    	
			
			if($id > 0){				
			    $query="SELECT r.* , concat(lastname,', ',firstname) tenant from rents r LEFT JOIN  tenants t ON r.tenant_id = t.tenant_id where r.building_id = $id and month = '$m' order by unitid asc";
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
		private function insertRent(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$rent = json_decode(file_get_contents("php://input"),true);
			$column_names = array( `building_id`, `unit_id`, `tenant_id`, `unitid`, `month`, `date_paid`, `receipt`, `rent_paid`, `due_this_mo`, `tenant_name`, `deposit_paid`, `comments`, `rent_owed`, `sort_month`, `adjustment`);
			$keys = array_keys($rent);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $rent[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			
			
			$query = "INSERT INTO rents(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Rent Created Successfully.", "data" => $rent);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		
		private function isDup($row) {

		    $r = $this->mysqli->query("select * from rents where unit_id = '".$row['unit_id']."' and month = '".$row['month']."'") or die($this->mysqli->error.__LINE__);
		   if($r->num_rows > 0)
		    return true;
		}
		
		private function addRents(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$bid = (int)$this->_request['id'];
            $tmp = date_parse($this->_request['m']);
            $n =$tmp['month']; 
            $date = date_create();
            date_date_set($date, $this->_request['y'], $n-1, 01);
            $m = substr(strtoupper(date_format($date, 'M')),0,3);
            $y = date_format($date, 'Y');
            $lastMonth ="$m/$y";
            $thisMonth = strtoupper(substr($this->_request['m'],0,3))."/".$this->_request['y'];
			if($bid > 0 ){				
                $query = "SELECT u.building_id, u.unit_id unit_id, unitnum, t.tenant_id, concat(lastname,', ',firstname) tenant, `type`, u.`status` status, t.move_in, t.move_out, price, u.unitid from units u LEFT JOIN tenants t ON u.tenant_id = t.tenant_id where u.building_id = $bid and move_in <= STR_TO_DATE('01/".$thisMonth."','%d/%b/%Y') and (move_out >= STR_TO_DATE('01/".$thisMonth."','%d/%b/%Y') or move_out = '') order by unitnum asc"; 
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
				    $row['month'] = $thisMonth;
				    $row['date_paid'] = $this->_request['y']."-".str_pad($n,2,'0',STR_PAD_LEFT)."-01";
				    $row['sort_month'] = $this->_request['y']."-".str_pad($n,2,'0',STR_PAD_LEFT)."-01";
				    $row['comments'] = "auto added";
				    $row['due_this_mo'] = $row['price'];
				    $row['adjustment'] = 0;
				    $row['rent_paid'] = 0;
				    $row['deposit_paid'] = 0;
				    $row['rent_owed'] = $row['price'];
				    $row['tenant_name'] = $row['tenant_name'];
					$result[] = $row;
					if(!$this->isDup($row)) $this->addRent($row);
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function addRent($arr){
			$rent = $arr;

			$column_names = array(
                            'building_id', 
                            'unit_id', 
                            'tenant_id', 
                            'unitid', 
                            'month', 
                            'date_paid', 
                            'receipt', 
                            'rent_paid', 
                            'due_this_mo', 
                            'tenant_name', 
                            'deposit_paid', 
                            'comments', 
                            'rent_owed', 
                            'sort_month', 
                            'adjustment'
			                );
			$keys = array_keys($rent);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $this->mysqli->real_escape_string($rent[$desired_key]);
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO rents(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function updateRent(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$rent = json_decode(file_get_contents("php://input"),true);
			$id = (int)$rent['id'];
			$column_names = array(
                            'building_id', 
                            'unit_id', 
                            'tenant_id', 
                            'unitid', 
                            'month', 
                            'date_paid', 
                            'receipt', 
                            'rent_paid', 
                            'due_this_mo', 
                            'tenant_name', 
                            'deposit_paid', 
                            'comments', 
                            'rent_owed', 
                            'sort_month', 
                            'adjustment'
			                );
			$keys = array_keys($rent['rent']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the rent received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $rent['rent'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE rents SET ".trim($columns,',')." WHERE rent_id=$id";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Rent ".$id." Updated Successfully.", "data" => $rent);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteRent(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM rents WHERE rent_id = $id";
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
			    $query="SELECT u.building_id, u.unit_id unit_id, unitnum, t.tenant_id, concat(lastname,', ',firstname) tenant, `type`, u.`status` status, t.move_in, price, u.unitid, u.total_bal_due from units u LEFT JOIN  tenants t ON u.tenant_id = t.tenant_id where u.building_id = $id order by unitnum asc";
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
			    $query="SELECT u.*, concat(lastname,', ',firstname) tenant from units u LEFT JOIN  tenants t ON u.tenant_id = t.tenant_id where u.unit_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
//prices
		private function prices(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = $this->_request['id'];
		    	
			
			    $query="SELECT * from unit_prices";
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
		
		private function price(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
			    $query="SELECT * from unit_prices where id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function insertPrice(){
		    $this->clearPrices();
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$price = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'unit_id', 'unitnum' ,'begin_date', 'end_date', 'rent','active');
			$keys = array_keys($price);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the price received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $price[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			
			$query = "INSERT INTO unit_prices(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($price)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Price Created Successfully.", "data" => $price);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}

		private function updatePrice(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$price = json_decode(file_get_contents("php://input"),true);
			$id = (int)$price['id'];
			$column_names = array(
                            'building_id', 
                            'unit_id', 
                            'unitnum',
                            'begin_date',
                            'end_date',
                            'rent',
                            'active'
			                );
			$keys = array_keys($price['price']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the price received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $price['price'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE unit_prices SET ".trim($columns,',')." WHERE id=$id";
			if(!empty($price)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Price ".$id." Updated Successfully.", "data" => $price);
				$query="update unit_prices set active = 0 where id != $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}

		private function clearPrices(){
				$query="update unit_prices set active = 0 where active != 0";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
		}
		
//units
		private function insertUnit(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$unit = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'tenant_id', 'building', 'unitnum', 'price', 'type', 'status', 'unitid','total_bal_due');
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
			$column_names = array('unit_id', 'building_id', 'tenant_id', 'building', 'unitnum', 'price', 'type', 'status', 'total_bal_due');
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
		
		private function deleteTenant(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM tenants WHERE tenant_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
		
		private function insertTenant(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$tenant = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'unit_id', 'unitid', 'lastname', 'firstname', 'ssn', 'creditcard', 'cardnumber', 'note', 'status', 'deposit_paid', 'firstmo_paid', 'lastmo_paid', 'other_paid', 'balance_due', 'move_in', 'move_out', '30_day_notice', 'other', 'drivers_license');
			$keys = array_keys($tenant);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $tenant[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO tenants(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($tenant)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$tenant['tenant_id'] = $this->mysqli->insert_id;
				$tid = (int)$tenant['tenant_id'];
				$uid = (int)$tenant['unit_id'];
                $query = "update units set tenant_id = $tid, status = 'Occupied' where unit_id = $uid";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);				
				$success = array('status' => "Success", "msg" => "tenant Created Successfully.", "data" => $tenant);
				
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}

		private function lastInsertID(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}		    	
			
            $query="SELECT last_insert_id() id";
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
		
		
		private function getRentsRange(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
                $query="select (select month from rents where building_id = $id order by `sort_month` asc limit 1) as first,(select month from rents where building_id = $id order by `sort_month` desc limit 1) as last from dual";
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
		
		
		private function firstYear(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}		    	
			
            $query="SELECT min(sort_month) id from rents";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$result[] = array("ID" => $query);
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function lastYear(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}		    	
			
            $query="SELECT max(sort_month) id from rents";
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
		
		private function updateTenant(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$tenant = json_decode(file_get_contents("php://input"),true);
			$id = (int)$tenant['id'];
			$column_names = array( 'building_id', 'unit_id', 'unitid', 'lastname', 'firstname', 'ssn', 'creditcard', 'cardnumber', 'note', 'status', 'deposit_paid', 'firstmo_paid', 'lastmo_paid', 'other_paid', 'balance_due', 'move_in', 'move_out', '30_day_notice', 'other', 'drivers_license');
			$keys = array_keys($tenant['tenant']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the unit received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $tenant['tenant'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE tenants SET ".trim($columns,',')." WHERE tenant_id=$id";
			if(!empty($tenant)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "tenant ".$id." Updated Successfully.", "data" => $tenant);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
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